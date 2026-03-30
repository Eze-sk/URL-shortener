import { query } from "@db/connectionPg"

export class logInternalError {
  static async create({ err, context }: { err: unknown, context: string }) {
    try {
      const message = err instanceof Error ? err.message : String(err)
      const stackTrace = err instanceof Error ? err.stack : null

      await query(
        "INSERT INTO error_log (context, message, stack_trace) VALUES ($1, $2, $3);",
        [context, message, stackTrace]
      );
    } catch (dbErr) {
      console.error(`Critical: Failed to save log to DB ${dbErr}`)
    }
  }

  static async getAll({ search = "", page = 1, limit = 10 }: { search?: string, page?: number, limit?: number }) {
    const offset = (page - 1) * limit

    const dataQuery = `
      SELECT id, context, message, stack_trace, created_at, updated_at
      FROM error_log
      WHERE message ILIKE $1
      ORDER BY id DESC 
      LIMIT $2 OFFSET $3
    `

    const countQuery = `
      SELECT COUNT(*) as total
      FROM error_log
      WHERE message ILIKE $1
    `

    try {
      const [dataRes, countRes] = await Promise.all([
        await query(dataQuery, [search, limit, offset]),
        await query(countQuery, [search])
      ])

      const totalRecords = parseInt(countRes.rows[0].total)

      return {
        meta: {
          total: totalRecords,
          page: page,
          lastPage: Math.ceil(totalRecords / limit),
          limit
        },
        data: dataRes.rows,
      }
    } catch (err) {
      console.error(`Critical: the database records could not be retrieved: ${err}`)
    }
  }

  static async remove({ id }: { id: number }) {
    try {
      await query(
        "DELETE FROM error_log WHERE id=$1",
        [id]
      )
    } catch (err) {
      console.error(`Critical: The record with id: ${id} could not be deleted from the database: ${err}`)
    }
  }

  static async removeAll() {
    try {
      await query("TRUNCATE TABLE error_log IDENTITY CASCADE;")
    } catch (err) {
      throw new Error(`Critical: It was not possible to delete all records from the database.: ${err}`)
    }
  }
}