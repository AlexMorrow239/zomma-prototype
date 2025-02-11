import { z } from "zod";

// Base schema for fields common to both registration and profile editing
const nameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
});

export const baseUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: nameSchema,
});

// Base password validation schema
const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password cannot exceed 100 characters");

// Full password schema for registration (with confirmation and strict rules)
const passwordSchema = z.object({
  password: passwordValidation.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
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
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),
  password: passwordValidation,
});

// Profile edit schema (just uses the base schema)
export const editProfileSchema = baseUserSchema;

// Type exports
export type BaseUserForm = z.infer<typeof baseUserSchema>;
export type RegistrationForm = z.infer<typeof registrationSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type EditProfileForm = z.infer<typeof editProfileSchema>;
