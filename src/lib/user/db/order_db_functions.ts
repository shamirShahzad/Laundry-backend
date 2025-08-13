import z, { success } from "zod";
import pool from "../../../db/config";
import { ERRORS } from "../../../util/enums";
import { Order, OrderItems } from "../../../models/order.model";
import { getCustomerById } from "./customer_db_functions";
import { create } from "node:domain";
import { createNotFoundError } from "../../../util/utilFunctions";
import { BAD_REQUEST_ERROR } from "../../../util/Errors";
import { PoolClient, QueryResult } from "pg";
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
    if (orderTup.rows.length == 0 || orderTup.rowCount == 0) {
      await client.query("ROLLBACK");
      return {
        success: false,
        errorMessage: MSG_ERROR_NOT_FOUND,
        error: OrderNotFound,
      };
    }
    await client.query("COMMIT");
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

type OrderResult =
  | { success: true; data: any }
  | { success: false; errorMessage: string; error: any };

export const createOrder = async (
  newOrderTup: z.infer<typeof Order>
): Promise<OrderResult> => {
  const { cust_id, total, paid_amount, notes, items } = newOrderTup;
  const client = await pool.connect();

  try {
    const customerTup = await getCustomerById(cust_id);
    if (customerTup.success == false) {
      return customerTup;
    }
    const qStr = `
        INSERT INTO orders(
        cust_id,
        notes,
        total,
        paid_amount
        ) VALUES (
         $1,
         $2,
         $3,
         $4
         ) RETURNING *`;
    const values = [cust_id, notes, total, paid_amount];
    await client.query("BEGIN");
    const orderTup = await client.query(qStr, values);
    if (orderTup.rowCount == 0) {
      return {
        success: false,
        errorMessage: "Something went wrong while creating order",
        error: BAD_REQUEST_ERROR,
      };
    }
    const orderId = orderTup.rows[0].id;
    const isOrderItemsSuccess = await createOrder_item(client, orderId, items);
    if (isOrderItemsSuccess.success == false) {
      return isOrderItemsSuccess;
    }
    await client.query("COMMIT");
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

const createOrder_item = async (
  client: PoolClient,
  order_id: number,
  items: z.infer<typeof OrderItems>[]
): Promise<OrderResult> => {
  const qStr = `
    INSERT INTO order_items(
    order_id,
    item_id,
    quantity,
    service_ids,
    amount
    ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
    ) RETURNING *`;

  try {
    for (let i = 0; i < items.length; i++) {
      const { item_id, quantity, service_ids, amount } = items[i];
      const values = [order_id, item_id, quantity, service_ids, amount];
      const orderItemsTup = await client.query(qStr, values);
      if (orderItemsTup.rowCount == 0) {
        await client.query("ROLLBACK");
        return {
          success: false,
          errorMessage: "Something went wrong while creating order items",
          error: BAD_REQUEST_ERROR,
        };
      }
    }
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while creating order items",
      error: error,
    };
  }
};

export const getOrdersForTable = async (filters: any) => {
  const conditions: string[] = [];
  const values: string[] = [];
  let i = 1;
  if (filters.cust_id) {
    conditions.push(`cust_id = $${i++}`);
    values.push(filters.cust_id);
  }
  if (filters.cus_phone) {
    conditions.push(`cust_phone = $${i++}`);
    values.push(filters.cus_phone);
  }
  if (filters.status) {
    conditions.push(`status = $${i++}`);
    values.push(filters.status);
  }
  if (filters.payment_status) {
    conditions.push(`payment_status = $${i++}`);
    values.push(filters.payment_status);
  }
  if (filters.quantity) {
    conditions.push(`quantity = $${i++}`);
    values.push(filters.quantity);
  }
  if (filters.item) {
    conditions.push(`item = $${i++}`);
    values.push(filters.item);
  }
  if (filters.item_total) {
    conditions.push(`item_total = $${i++}`);
    values.push(filters.item_total);
  }
  if (filters.total_amount) {
    conditions.push(`total_amount = $${i++}`);
    values.push(filters.total_amount);
  }
  if (filters.from) {
    conditions.push(`created_at >= $${i++}`);
    values.push(filters.from);
  }
  if (filters.to) {
    conditions.push(`created_at <= $${i++}`);
    values.push(filters.to);
  }
  if (filters.from && filters.to) {
    conditions.push(`created_at BETWEEN $${i++} AND $${i++}`);
    values.push(filters.from);
    values.push(filters.to);
  }
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const qStr = `
        SELECT
              c.name as cust_name,
              c.phone as cust_phone,
              o.status,
              o.payment_status,
              o.total,
              o.notes,
              o.created_at,
              o.updated_at,
              JSON_AGG(
              JSON_BUILD_OBJECT(
                    'name',i.name,
                    'amount',oi.amount,
                    'quantity',oi.quantity,
                    'image',i.image,
                    'services',(
                          SELECT ARRAY_AGG(s.name)
                          FROM UNNEST(oi.service_ids) AS sid
                          JOIN services s ON s.id = sid
                    )
                )
              ) AS items
        FROM orders o
        JOIN customers c ON o.cust_id = c.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN items i ON oi.item_id = i.id
        GROUP BY
              c.name,
              c.phone,
              o.status,
              o.payment_status,
              o.total,
              o.notes,
              o.created_at,
              o.updated_at
         ${whereClause} ORDER BY o.created_at DESC;
    `;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, values);
    if (result.rows.length == 0) {
      await client.query("ROLLBACK");
      return {
        success: false,
        errorMessage: MSG_ERROR_NOT_FOUND,
        error: OrderNotFound,
      };
    }
    await client.query("COMMIT");
    return {
      success: true,
      data: result.rows,
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
