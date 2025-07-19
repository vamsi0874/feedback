import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    adminInviteToken: z.string().optional(),
  });
  
 export const loginSchema = z.object({
   
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });