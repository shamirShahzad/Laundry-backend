import z from "zod";
import { Customer } from "../../../models/customer.model";
import pool from "../../../db/config";
import { ERRORS } from "../../../util/enums";
const { ERROR_NOT_FOUND } = ERRORS;
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

export const getCustomerById = async (id: number) => {
  const client = await pool.connect();
  const qStr = `
    SELECT * FROM customers WHERE id = $1    
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [id]);
    await client.query("COMMIT");
    if (result.rows.length == 0) {
      return {
        success: false,
        errorMessage: ERROR_NOT_FOUND,
        error: ERROR_NOT_FOUND,
      };
    }
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while getting customer",
      error: err,
    };
  } finally {
    client.release(true);
  }
};

export const getCustomerByPhone = async (phone: string) => {
  const client = await pool.connect();
  const qStr = `
    SELECT * FROM customers WHERE phone = $1    
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [phone]);
    await client.query("COMMIT");
    if (result.rows.length == 0) {
      return {
        success: false,
        errorMessage: ERROR_NOT_FOUND,
        error: ERROR_NOT_FOUND,
      };
    }
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while getting customer",
      error: err,
    };
  } finally {
    client.release(true);
  }
};

export const getAllCustomers = async () => {
  const client = await pool.connect();
  const qStr = `SELECT * FROM customers`;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr);
    await client.query("COMMIT");
    if (result.rows.length == 0) {
      return {
        success: false,
        errorMessage: ERROR_NOT_FOUND,
        error: ERROR_NOT_FOUND,
      };
    }
    return {
      success: true,
      data: result.rows,
    };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while getting customers",
      error: err,
    };
  } finally {
    client.release(true);
  }
};
