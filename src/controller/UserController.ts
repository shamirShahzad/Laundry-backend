import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { v4 } from "uuid";
import { Roles } from "../util/enums";
import pool from "../db/config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { mapErrors } from "../util/utilFunctions";
import { STATUS_CODES } from "../util/enums";
import { loginRequestTup } from "../schema/user.schema";
import { loginUser, registerUser } from "../lib/user/db/user_db_functions";
import * as jwt from "jsonwebtoken";

const { SUCCESS_CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS } =
  STATUS_CODES;

const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    let newUser: z.infer<typeof User>;
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
      return res.status(BAD_REQUEST).send({
        success: false,
        statusCode: BAD_REQUEST,
        message: "Something went wrong while parsing data",
        errorMessage: {
          name: validationError.name,
          message: mapErrors(validationError.message),
        },
      });
    }

    //Sql query for adding the new user to the users tables using a transaction

    const registerTup = await registerUser(newUser, res);
    if (registerTup.success == false) {
      res.status(INTERNAL_SERVER_ERROR);
      return next(new Error(registerTup.errorMessage));
    }
    //If all goes well then we hit this
    return res.status(SUCCESS_CREATED).send({
      success: true,
      statusCode: SUCCESS_CREATED,
      message: "User registered successfully",
      data: registerTup.data,
    });
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    let loginReq: z.infer<typeof loginRequestTup>;
    try {
      loginReq = loginRequestTup.parse(req.body);
      if (!loginReq.email || !loginReq.password) {
        res.status(BAD_REQUEST);
        return next(new Error("Email or password not provided"));
      }
    } catch (error: any) {
      res.status(INTERNAL_SERVER_ERROR);
      return next(error);
    }
    const loginTup = await loginUser(loginReq.email);

    if (loginTup.success == false) {
      res.status(BAD_REQUEST);
      return next(new Error(loginTup.errorMessage));
    }

    const isPasswordMatch = await bcrypt.compare(
      loginReq.password,
      loginTup.data.password
    );

    if (!isPasswordMatch) {
      res.status(BAD_REQUEST);
      return next(new Error("Invalid email or password"));
    }

    // return res.status(SUCCESS).send({
    //   success: true,
    //   statusCode: SUCCESS,
    //   message: "User logged in successfully",
    //   data: loginTup.data,
    // });

    const token = jwt.sign(
      {
        id: loginTup?.data?.id,
      },
      process?.env?.JWT_SECRET!,
      {
        expiresIn: "3d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(SUCCESS).send({
      success: true,
      statusCode: SUCCESS,
      message: "User logged in successfully",
      data: loginTup.data,
      token,
    });
  },
};

export default userController;
