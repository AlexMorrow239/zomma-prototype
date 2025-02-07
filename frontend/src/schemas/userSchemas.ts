import { z } from "zod";

// Base schema for fields common to both registration and profile editing
export const baseUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Password validation schema
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
});

// Registration schema that extends the base schema with password fields
export const registrationSchema = baseUserSchema
  .merge(passwordSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Profile edit schema (just uses the base schema)
export const editProfileSchema = baseUserSchema;

// Type exports
export type BaseUserForm = z.infer<typeof baseUserSchema>;
export type RegistrationForm = z.infer<typeof registrationSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type EditProfileForm = z.infer<typeof editProfileSchema>;
