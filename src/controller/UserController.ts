import { Request, Response } from "express";
const userController = {
  register: (req: Request, res: Response) => {},
  login: (req: Request, res: Response) => {
    res.send("User logged in");
  },
};

export default userController;
