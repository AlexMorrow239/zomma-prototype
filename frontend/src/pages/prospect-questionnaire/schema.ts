import { z } from "zod";

import { nameSchema } from "@/common/commonSchemas";

export const prospectSchema = z.object({
  contact: z.object({
    name: nameSchema,
    businessName: z.string().optional(),
    preferredContact: z.enum(["email", "phone", "text"], {
      required_error: "Please select a preferred contact method",
    }),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
  goals: z.object({
    financialGoals: z
      .string()
      .min(1, "Please describe your financial goals")
      .min(10, "Financial goals description should be at least 10 characters"),
    challenges: z
      .string()
      .min(1, "Please describe your challenges")
      .min(10, "Challenges description should be at least 10 characters"),
  }),
  services: z.object({
    selectedServices: z
      .array(z.string())
      .min(1, "Please select at least one service"),
  }),
  budget: z.object({
    budgetRange: z.string({
      required_error: "Please select a budget range",
    }),
  }),
  status: z.enum(["pending", "contacted"]).default("pending").optional(),
  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .optional(),
});

type ContactPaths =
  | `contact.name.${keyof ProspectFormData["contact"]["name"]}`
  | `contact.${Exclude<keyof ProspectFormData["contact"], "name">}`;

export type ProspectFormPaths =
  | ContactPaths
  | `goals.${keyof ProspectFormData["goals"]}`
  | `services.${keyof ProspectFormData["services"]}`
  | `budget.${keyof ProspectFormData["budget"]}`;

export type ProspectFormData = z.infer<typeof prospectSchema>;
