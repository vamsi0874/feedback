import { z } from 'zod';


export const assignmnetSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(3),
   file: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
      message: 'A valid file must be uploaded',
    }).optional(),
  due_date: z.string().min(1),
  
});

export const submitAssignmentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
  file: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
      message: 'A valid file must be uploaded',
    }).optional(),
});


  
 export const loginSchema = z.object({
   
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  
  export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().optional(),
  });