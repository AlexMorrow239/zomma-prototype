import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_API_TIMEOUT: z.string().regex(/^\d+$/),
  VITE_ENV: z.enum(["development", "staging", "production"]),
});

export const validateEnv = (): void => {
  try {
    envSchema.parse(import.meta.env);
  } catch (error) {
    console.error("Invalid environment variables:", error);
    throw new Error("Invalid environment configuration");
  }
};
