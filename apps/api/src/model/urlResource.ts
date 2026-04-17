import { query } from "@db/connectionPg";

import { logInternalError } from "./logInternalError";

import type { ShortenedURLType } from "@/typescript/DatabaseSchema";

export type UrlGetType = {
  id: string
  original_url: string
  expires_at: string | null
} | null

export class urlResourceModel {
  static async create({ data }: { data: ShortenedURLType }) {
    try {
      const { original_url, slug, user_id } = data

      const result = await query(
        `
          INSERT INTO url_data (original_url, slug, user_id)
          VALUES ($1, $2, $3)
          RETURNING *
        `,
        [original_url, slug, user_id]
      )

      if (result.rows.length === 0) return null

      return result.rows[0]
    } catch (err) {
      await logInternalError.create({ err, context: "URL_MODEL_CREATE" })
      throw new Error('Could not create shortened URL')
    }
  }

  static async update({ data }: { data: ShortenedURLType }) {
    try {
      const { old_slug, original_url, user_id, slug, expires_at } = data

      const result = await query(
        /*sql*/`
          UPDATE url_data 
          SET 
            slug = $1, 
            original_url = $2, 
            expires_at = $3,
            updated_at = CURRENT_TIMESTAMP
          WHERE slug = $4 
            AND user_id = $5
          RETURNING *;
        `,
        [
          slug,
          original_url,
          expires_at,
          old_slug,
          user_id
        ]
      )

      if (result.rows.length === 0) return null

      return result.rows[0]
    } catch (err) {
      await logInternalError.create({ err, context: "URL_MODEL_UPDATE" })
      throw new Error('The shortened URL could not be updated.')
    }
  }

  static async delete({ slug }: { slug: string }) {
    try {
      const result = await query(
        "DELETE FROM url_data WHERE slug=$1",
        [slug]
      )

      if (result.rows.length === 0) return null
    } catch (err) {
      await logInternalError.create({ err, context: "URL_MODEL_DELETE" })
      throw new Error('The shortened URL could not be removed')
    }
  }

  static async get({ slug }: { slug: string }): Promise<UrlGetType> {
    try {
      const result = await query(
        `SELECT id, original_url, expires_at FROM url_data WHERE slug = $1 LIMIT 1;`,
        [slug]
      )

      if (result.rows.length === 0) return null

      return {
        id: result.rows[0].id ?? "",
        original_url: result.rows[0].original_url ?? "",
        expires_at: result.rows[0].expires_at ?? null
      }
    } catch (err) {
      await logInternalError.create({ err, context: "URL_MODEL_GET" })
      throw new Error('The shortened URL could not be obtained.')
    }
  }
}