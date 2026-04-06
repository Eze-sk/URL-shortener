import { nanoid } from "nanoid";
import { urlScheme } from "@repo/schemes";
import { verifyUrl } from "@utils/verifyUrl";
import type { Request, Response } from 'express';
import { urlResourceModel } from "@model/urlResource";
import { logInternalError } from "@model/logInternalError";
import type { ShortenedURLType } from "@typescript/DatabaseSchema";

export class urlResourceController {
  static async create(req: Request, res: Response) {
    const { original_url, expires_at } = req.body

    if (!original_url) {
      return res.status(400).json({ error: 'The original URL is required.' });
    }

    const urlValidation = urlScheme.safeParse(original_url)

    if (!urlValidation.success) {
      return res.status(422).json({ error: 'The correct URL is required.' });
    }

    try {
      const { isSafe, details, err } = await verifyUrl({ url: original_url })

      if (err) {
        logInternalError.create({ err, context: "URL_CONTROLLER_CREATE_VERIFYURL" })
      }

      if (!isSafe) {
        return res.status(403).json({
          error: 'Security Risk Detected',
          message: 'This URL has been flagged as unsafe by Google Safe Browsing.',
          details: details
        })
      }

      const slug = nanoid(7)

      const data: ShortenedURLType = {
        original_url,
        slug,
        expires_at
      }

      const resultCreatingURL = await urlResourceModel.create({ data })

      return res.status(201).json({
        mensaje: 'Shortened URL created successfully',
        resultCreatingURL,
      })
    } catch (err) {
      logInternalError.create({ err, context: "URL_CONTROLLER_CREATE" })
      return res.status(500).json({ message: "Internal error" })
    }
  }

  static async update(req: Request, res: Response) {
    const { original_url, slug } = req.body

    if (!original_url || !slug) {
      return res.status(400).json({ error: 'The original URL and the short URL are required.' })
    }

    try {
      const { isSafe, details, err } = await verifyUrl({ url: original_url })

      if (err) {
        logInternalError.create({ err, context: "URL_CONTROLLER_UPDATE_VERIFYURL" })
      }

      if (!isSafe) {
        return res.status(403).json({
          error: 'Security Risk Detected',
          message: 'This URL has been flagged as unsafe by Google Safe Browsing.',
          details: details
        })
      }

      const data: ShortenedURLType = {
        original_url,
        slug
      }

      const resultUpdateURL = await urlResourceModel.update({ data })

      return res.status(201).json({
        mensaje: 'Shortened URL update successfully',
        data: resultUpdateURL,
      })
    } catch (err) {
      logInternalError.create({ err, context: "URL_CONTROLLER_UPDATE" })
      return res.status(500).json({ message: "Internal error" })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { slug } = req.body

      if (!slug) {
        return res.status(400).json({ error: 'The slug is required.' })
      }

      let formattedURL = slug

      if (slug.includes("https://")) {
        formattedURL = slug.split('/').pop()
      }

      await urlResourceModel.delete({
        slug: formattedURL
      })

      return res.status(200).json({
        mensaje: 'The shortened URL has been successfully removed',
      })
    } catch (err) {
      logInternalError.create({ err, context: "URL_CONTROLLER_DELETE" })
      return res.status(500).json({ message: "Internal error" })
    }
  }
}