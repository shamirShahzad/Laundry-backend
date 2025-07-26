import { Item, ItemUpdate } from "../../../models/item.model";
import z, { success } from "zod";
import pool from "../../../db/config";
import { ERRORS } from "../../../util/enums";
import { error } from "console";
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND } = ERRORS;
export const createItem = async (newItem: z.infer<typeof Item>) => {
  const client = await pool.connect();
  const { name, price, description } = newItem;
  let qStr = `
    INSERT INTO items (
    name,
    price,
    description,
    created_at,
    updated_at
    ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
    ) RETURNING *
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [
      name,
      price,
      description,
      new Date(),
      null,
    ]);
    await client.query("COMMIT");

    if (result.rows.length == 0) {
      return {
        success: false,
        errorMessage: ERROR_NOT_FOUND,
        error: ERROR_NOT_FOUND,
      };
    } else if (result.rowCount == 0) {
      return {
        success: false,
        errorMessage: ERROR_BAD_REQUEST,
        error: ERROR_BAD_REQUEST,
      };
    }
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while creating item",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const getItemById = async (id: string) => {
  const client = await pool.connect();
  const qStr = `
    SELECT * FROM items WHERE id = $1`;
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
  } catch (error: any) {
    return {
      success: false,
      errorMessage: "Something went wrong while getting item",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const getAllItems = async () => {
  const client = await pool.connect();
  const qStr = `
    SELECT * FROM items`;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr);
    await client.query("COMMIT");
    if (result.rows.length == 0) {
      return {
        success: false,
        error: ERROR_NOT_FOUND,
        errorMEssage: ERROR_NOT_FOUND,
      };
    }
    return {
      success: true,
      data: result.rows,
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      error: error,
      errorMessage: "Something went wrong while retreiving items",
    };
  } finally {
    client.release(true);
  }
};

export const deleteItem = async (id: string) => {
  const client = await pool.connect();
  const qStr = `
    DELETE FROM items WHERE id = $1`;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [id]);
    await client.query("COMMIT");
    if (result.rowCount == 0) {
      return {
        success: false,
        errorMessage: ERROR_NOT_FOUND,
        error: ERROR_NOT_FOUND,
      };
    }
    return {
      success: true,
      message: "Item deleted successfully",
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while deleting item",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const updateItem = async (item: z.infer<typeof ItemUpdate>) => {
  const client = await pool.connect();
  const { id, name, price, description } = item;
  const qStr = `
    UPDATE items SET
    name = $1,
    price = $2,
    description = $3,
    updated_at = $4
    WHERE id = $5
    RETURNING *
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [
      name,
      price,
      description,
      new Date(),
      id,
    ]);
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
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while updating item",
      error: error,
    };
  } finally {
    client.release(true);
  }
};
