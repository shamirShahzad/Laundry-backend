import pool from "../../../db/config";
import { z } from "zod";
import { v4 } from "uuid";
import { User } from "../../../models/user.model";

export const registerUser = async (newUser: z.infer<typeof User>) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const queryStr = `
                INSERT INTO users
                (id,
                name,
                email,
                password,
                phone,
                role,
                created_at,
                updated_at)


                VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8)
                RETURNING id,name,email,phone,role,created_at,updated_at
              `;
    const result = await client.query(queryStr, [
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.phone,
      newUser.role,
      newUser.created_at,
      newUser.updated_at,
    ]);

    // Commit the transaction
    await client.query("COMMIT");
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (insertionError: any) {
    //Rollback if any error in adding data
    await client.query("ROLLBACK");

    return {
      success: false,
      errorMessage: "Something went wrong while registering user",
      error: insertionError,
    };
  } finally {
    client.release(true);
  }
};

export const loginUser = async (email: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const queryStr = `Select * from users where email = $1`;
    const result = await client.query(queryStr, [email]);
    await client.query("COMMIT");
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while logging in",
      error: err,
    };
  } finally {
    client.release(true);
  }
};

export const getUserById = async (id: string) => {
  const client = await pool.connect();
  const queryStr = `
    SELECT
          id,
          name,
          email,
          phone,
          role,
          created_at,
          updated_at
    FROM users
    WHERE id = $1
  `;
  try {
    await client.query("BEGIN");

    const result = await client.query(queryStr, [id]);
    console.log(result);
    await client.query("COMMIT");
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    await client.query("ROLLBACK");
    return {
      success: false,
      errorMessage: "Something went wrong while getting user",
      error: err,
    };
  } finally {
    client.release(true);
  }
};
