import z from "zod";
import pool from "../../../db/config";
import { ERRORS } from "../../../util/enums";
import { Order } from "../../../models/order.model";
import { getCustomerById } from "./customer_db_functions";
import { create } from "node:domain";
import { createNotFoundError } from "../../../util/utilFunctions";
import { BAD_REQUEST_ERROR } from "../../../util/Errors";
const { MSG_ERROR_NOT_FOUND } = ERRORS;

const OrderNotFound = createNotFoundError("Order");

export const getAllOrders = async (filters: any) => {
  const condition: string[] = [];
  const values: string[] = [];
  let i = 1;
  if (filters.cust_id) {
    condition.push(`cust_id = $${i++}`);
    values.push(filters.cust_id);
  }
  if (filters.status) {
    condition.push(`status = $${i++}`);
    values.push(filters.status);
  }
  if (filters.payment_status) {
    condition.push(`payment_status = $${i++}`);
    values.push(filters.payment_status);
  }
  if (filters.id) {
    condition.push(`id = $${i++}`);
    values.push(filters.id);
  }
  if (filters.from) {
    condition.push(`created_at >= $${i++}`);
    values.push(filters.from);
  }
  if (filters.to) {
    condition.push(`created_at <= $${i++}`);
    values.push(filters.to);
  }
  if (filters.from && filters.to) {
    condition.push(`created_at BETWEEN $${i++} AND $${i++}`);
    values.push(filters.from);
    values.push(filters.to);
  }
  const whereClause =
    condition.length > 0 ? `WHERE ${condition.join(" AND ")}` : "";
  const qStr = `
        SELECT * FROM orders ${whereClause} ORDER BY created_at DESC;
    `;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const orderTup = await client.query(qStr, values);
    await client.query("COMMIT");
    if (orderTup.rows.length == 0 || orderTup.rowCount == 0) {
      return {
        success: false,
        errorMessage: MSG_ERROR_NOT_FOUND,
        error: OrderNotFound,
      };
    }
    return {
      success: true,
      data: orderTup.rows,
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while getting orders",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const createOrder = async (newOrderTup: z.infer<typeof Order>) => {
  const { cust_id, status, payment_status, notes } = newOrderTup;
  const client = await pool.connect();
  try {
    const customerTup = await getCustomerById(cust_id);
    if (customerTup.success == false) {
      return customerTup;
    }
    const qStr = `
        INSERT INTO orders(
        cust_id,
        status,
        payment_status,
        notes
        ) VALUES (
         $1,
         $2,
         $3,
         $4
         ) RETURNING *`;
    const values = [Number(cust_id), status, payment_status, notes];
    await client.query("BEGIN");
    const orderTup = await client.query(qStr, values);
    await client.query("COMMIT");
    if (orderTup.rowCount == 0) {
      return {
        success: false,
        errorMessage: "Something went wrong while creating order",
        error: BAD_REQUEST_ERROR,
      };
    }
    return {
      success: true,
      data: orderTup.rows[0],
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while creating order",
      error: error,
    };
  } finally {
    client.release(true);
  }
};
