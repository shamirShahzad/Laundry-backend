import { Request } from "express";
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  created_at: Date;
  updated_at: Date | null;
}
export interface AuthenticatedRequest extends Request {
  user?: User | null;
}
