import { useMutation } from '@tanstack/react-query';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';


const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(),
});

export default function SignupPage() {
 
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      console.log('Registration successful');
      
    },
    onError: (err) => {
        
      console.log("Registration failed", err);
   
      const errorMsg =
        (err as any)?.response?.data?.errors?.email[0] ||
        (err as any)?.response?.data?.errors?.name[0] ||
        "name already exists";
      setError(errorMsg);
    }
    
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
   
      mutate(data);
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        <input
          {...register("name")}
          placeholder="name"
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}

        {/* <input
          {...register("role")}
          type="text"
          placeholder="role (optional)"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        /> */}
        <select {...register("role")}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
            
          >
        
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
        )}
       
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
     

        <button
          type="submit"
          className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700 transition text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

  
        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <NavLink to="/login" className="text-blue-600 hover:underline">
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
}
