import z from "zod";
import { Customer } from "../../../models/customer.model";
import pool from "../../../db/config";

export const createCustomer = async (newCustomer: z.infer<typeof Customer>) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const qryStr = `INSERT INTO customers
            (name,
            email,
            phone,
            address,
            created_at,
            updated_at)
            VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6)
            RETURNING id,name,email,phone,address,created_at,updated_at
            `;
    const result = await client.query(qryStr, [
      newCustomer.name,
      newCustomer.email,
      newCustomer.phone,
      newCustomer.address,
      newCustomer.created_at,
      newCustomer.updated_at,
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
      errorMessage: "Something went wrong while creating customer",
      error: error,
    };
  } finally {
    client.release(true);
  }
};
