import z from "zod";
import { Service } from "../../../models/service.model";
import pool from "../../../db/config";

export const createService = async (serviceTup: z.infer<typeof Service>) => {
  const client = await pool.connect();
  const qStr = `
    INSERT INTO services (
    name,
    description,
    created_at,
    updated_at
    ) VALUES (
    $1,
    $2,
    $3,
    $4
    ) RETURNING *`;

  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [
      serviceTup.name,
      serviceTup.description,
      new Date(),
      null,
    ]);
    await client.query("COMMIT");
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while creating service",
      error: error,
    };
  } finally {
    client.release(true);
  }
};
