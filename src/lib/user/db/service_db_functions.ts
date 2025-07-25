import z from "zod";
import { Service, ServiceUpdate } from "../../../models/service.model";
import pool from "../../../db/config";
import { ERRORS } from "../../../util/enums";
const { ERROR_NOT_FOUND } = ERRORS;

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
      errorMessage: "Something went wrong while creating service",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const getServiceById = async (id: string) => {
  const client = await pool.connect();
  const qStr = `
    SELECT * FROM services WHERE id = $1`;
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
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while getting service",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const getAllServices = async () => {
  const client = await pool.connect();
  const qStr = `SELECT * FROM services`;
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
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while getting services",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const updateService = async (service: z.infer<typeof ServiceUpdate>) => {
  const { id, name, description } = service;
  const client = await pool.connect();
  const qStr = `
    UPDATE services SET
    name =$1,
    description = $2,
    updated_at = $3
    WHERE id = $4
    RETURNING *
    `;
  try {
    await client.query("BEGIN");
    const result = await client.query(qStr, [
      name,
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
      errorMessage: "Something went wrong while updating service",
      error: error,
    };
  } finally {
    client.release(true);
  }
};

export const deleteService = async (id: string) => {
  const client = await pool.connect();
  const qStr = `
    DELETE FROM services WHERE id = $1`;
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
      message: "Service deleted successfully",
      data: {},
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while deleting service",
      error: error,
    };
  } finally {
    client.release(true);
  }
};
