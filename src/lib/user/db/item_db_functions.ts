import { Item, ItemUpdate } from "../../../models/item.model";
import z from "zod";
import pool from "../../../db/config";
import { ERRORS } from "../../../util/enums";
import { createNotFoundError } from "../../../util/utilFunctions";
import { BAD_REQUEST_ERROR } from "../../../util/Errors";
const { MSG_ERROR_BAD_REQUEST, MSG_ERROR_NOT_FOUND } = ERRORS;

const ItemNotFound = createNotFoundError("Item");

export const createItem = async (newItem: z.infer<typeof Item>) => {
  const client = await pool.connect();
  const { name, price, description, image } = newItem;
  let qStr = `
    INSERT INTO items (
    name,
    price,
    description,
    image,
    created_at,
    updated_at
    ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
    ) RETURNING *
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [
      name,
      price,
      description,
      image,
      new Date(),
      null,
    ]);
    await client.query("COMMIT");

    if (result.rows.length == 0) {
      return {
        success: false,
        errorMessage: MSG_ERROR_NOT_FOUND,
        error: ItemNotFound,
      };
    } else if (result.rowCount == 0) {
      return {
        success: false,
        errorMessage: MSG_ERROR_BAD_REQUEST,
        error: BAD_REQUEST_ERROR,
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
        errorMessage: MSG_ERROR_NOT_FOUND,
        error: ItemNotFound,
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
        error: MSG_ERROR_NOT_FOUND,
        errorMEssage: ItemNotFound,
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
        errorMessage: MSG_ERROR_NOT_FOUND,
        error: ItemNotFound,
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
  const { id, name, price, description, image } = item;
  const qStr = `
    UPDATE items SET
    name = $1,
    price = $2,
    description = $3,
    image = $4,
    updated_at = $5
    WHERE id = $6
    RETURNING *
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [
      name,
      price,
      description,
      image,
      new Date(),
      id,
    ]);
    await client.query("COMMIT");
    if (result.rows.length == 0) {
      return {
        success: false,
        errorMessage: MSG_ERROR_NOT_FOUND,
        error: ItemNotFound,
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
