import { Request, Response } from "express";
import { User } from "../models/user.model";
import { v4 } from "uuid";
import { Roles } from "../util/enums";
import pool from "../db/config";
import { success, z } from "zod";
import bcrypt from "bcrypt";
import { mapErrors } from "../util/utilFunctions";
import { STATUS_CODES } from "../util/enums";

const userController = {
  register: async (req: Request, res: Response) => {
    let newUser: z.infer<typeof User>;
    const client = await pool.connect();
    //Creating a hashed password and parsing data from the request object to the
    //user model
    try {
      const myUser = req.body;
      myUser.id = v4();
      myUser.role = Roles.USER;
      myUser.created_at = new Date();
      myUser.updated_at = null;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(myUser.password, salt);
      myUser.password = hashedPassword;
      newUser = User.parse(myUser);
    } catch (validationError: any) {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        success: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Something went wrong while parsing data",
        errorMessage: {
          name: validationError.name,
          message: mapErrors(validationError.message),
        },
      });
    }

    //Sql query for adding the new user to the users tables using a transaction
    try {
      await client.query("BEGIN");
      const queryStr = `
        INSERT INTO users (id,name,email,password,phone,role,created_at,updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `;
      await client.query(queryStr, [
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
    } catch (insertionError: any) {
      //Rollback if any error in adding data
      await client.query("ROLLBACK");

      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        success: false,
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: "Something went wrong while registering user",
        error: insertionError,
      });
    } finally {
      client.release();
    }

    return res.status(STATUS_CODES.SUCCESS_CREATED).send({
      success: true,
      statusCode: STATUS_CODES.SUCCESS_CREATED,
      message: "User registered successfully",
    });
  },
  login: (req: Request, res: Response) => {
    res.send("User logged in");
  },
};

export default userController;
