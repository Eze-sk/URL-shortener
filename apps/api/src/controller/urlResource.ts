import { nanoid } from "nanoid";
import { urlScheme, customData } from "@repo/schemes";
import { verifyUrl } from "@utils/verifyUrl";
import type { Request, Response } from 'express';
import { urlResourceModel } from "@model/urlResource";
import { logInternalError } from "@model/logInternalError";
import type { ShortenedURLType } from "@typescript/DatabaseSchema";

export class urlResourceController {
  static async create(req: Request, res: Response) {
    const { original_url } = req.body as ShortenedURLType
    const user_id = req.user?.id

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

      const data: ShortenedURLType = {
        original_url,
        slug: nanoid(7),
        user_id: user_id ?? null,
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
    const { old_slug } = req.params;
    const { original_url, slug, expires_at } = req.body as ShortenedURLType
    const user_id = req.user?.id

    if (!old_slug) {
      return res.status(400).json({ error: 'The original slug is mandatory.' })
    }

    const data = {
      original_url,
      slug,
      expires_at
    }

    const verifyData = customData.safeParse(data)

    if (!verifyData.success) {
      const firstIssue = verifyData.error.issues[0];

      return res.status(403).json({
        error: `Server error: ${firstIssue?.message || "Invalid data"}`
      })
    }

    try {
      if (verifyData.data.original_url) {
        const { isSafe, details, err } = await verifyUrl({ url: verifyData.data.original_url })

        if (err) {
          logInternalError.create({ err, context: "URL_CONTROLLER_UPDATE_VERIFYURL" })

          return res.status(403).json({
            message: 'Error verifying the URL.',
            details: details
          })
        }

        if (!isSafe) {
          return res.status(403).json({
            error: 'Security Risk Detected',
            message: 'This URL has been flagged as unsafe by Google Safe Browsing.',
            details: details
          })
        }
      }

      const resultUpdateURL = await urlResourceModel.update({
        data: {
          user_id,
          old_slug: old_slug.toString(),
          ...verifyData.data
        }
      })

      return res.status(201).json({
        message: 'Shortened URL update successfully',
        data: resultUpdateURL,
      })
    } catch (err) {
      logInternalError.create({ err, context: "URL_CONTROLLER_UPDATE" })
      return res.status(500).json({ message: "Internal error" })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res.status(400).json({ error: 'The slug is required.' })
      }

      await urlResourceModel.delete({
        slug: slug.toString()
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