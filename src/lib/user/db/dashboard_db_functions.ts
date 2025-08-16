import pool from "../../../db/config";
import { ERRORS } from "../../../util/enums";
import { createNotFoundError } from "../../../util/utilFunctions";
const { MSG_ERROR_NOT_FOUND } = ERRORS;

const OrderNotFound = createNotFoundError("Order");
export const getChartData = async () => {
  const client = await pool.connect();
  const qStr = `
    SELECT
        TO_CHAR(created_at,'YYYY-MM-DD') as date,
        COUNT(*) as order
    FROM orders
    GROUP BY date
    ORDER BY date
    `;
  try {
    client.query("BEGIN");
    const result = await client.query(qStr);
    if (result.rows.length == 0 || result.rowCount == 0) {
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
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while retreiving orders",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const getLatestOrders = async () => {
  const client = await pool.connect();
  const qStr = `
        SELECT
              o.id,
              c.name as cust_name,
              c.phone as cust_phone,
              o.status,
              o.payment_status,
              o.paid_amount,
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
              o.updated_at,
              o.id,
              o.paid_amount
          ORDER BY o.created_at DESC LIMIT 10;
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr);
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
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while retreiving orders",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const getLatestCustomers = async () => {
  const client = await pool.connect();
  const qStr = `
    SELECT * FROM customers ORDER BY created_at DESC LIMIT 10;
    `;
  try {
    const result = await client.query(qStr);
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
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while retreiving orders",
      error: error,
    };
  } finally {
    client.release(true);
  }
};
