import { query } from "@db/connectionPg";
import { logInternalError } from "./logInternalError";

export class urlAnalyticsModel {
  static async create({ id, user_agent, country, referer }: { id: string, user_agent: string, country: string, referer: string }) {
    try {
      await query(
        "INSERT INTO visits_url (url_data_id, user_agent, country, referer) VALUES ($1, $2, $3, $4)",
        [id, user_agent, country, referer]
      )
    } catch (err) {
      await logInternalError.create({ err, context: "URL_STATISTICS_MODEL_CREATE" })
      throw new Error('The statistics could not be saved.')
    }
  }

  static async getAll() {

  }

  static async delete() {

  }
}