import { urlResourceModel } from "@model/urlResource";
import { nanoid } from "nanoid";
import type { Request, Response } from 'express';
import { logInternalError } from "@model/logInternalError";
import type { ShortenedURLType } from "@/typescript/DatabaseSchema";
import { verifyUrl } from "@/utils/verifyUrl";

export class urlResourceController {
  static async create(req: Request, res: Response) {
    const { original_url, expires_at } = req.body

    if (!original_url) {
      return res.status(400).json({ error: 'The original URL is required.' });
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

      const shortenedURL = nanoid(7)

      const data: ShortenedURLType = {
        original_url,
        short_url: shortenedURL,
        expires_at
      }

      const resultCreatingURL = await urlResourceModel.create({ data })

      return res.status(201).json({
        mensaje: 'Shortened URL created successfully',
        data: resultCreatingURL,
      })
    } catch (err) {
      logInternalError.create({ err, context: "URL_CONTROLLER_CREATE" })
      return res.status(500).json({ message: "Internal error" })
    }
  }

  static async update(req: Request, res: Response) {
    const { original_url, short_url } = req.body

    if (!original_url || !short_url) {
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
        short_url
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
      const { short_url } = req.body

      if (!short_url) {
        return res.status(400).json({ error: 'The short_url is required.' })
      }

      let formattedURL = short_url

      if (short_url.includes("https://")) {
        formattedURL = short_url.split('/').pop()
      }

      await urlResourceModel.delete({
        short_url: formattedURL
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