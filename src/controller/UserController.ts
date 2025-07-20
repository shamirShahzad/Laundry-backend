const userController = {
  register: (req: any, res: any) => {
    res.send("User registered");
  },
  login: (req: any, res: any) => {
    res.send("User logged in");
  },
};

export default userController;
