import { z } from "zod";

export const prospectSchema = z.object({
  contact: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    businessName: z.string().optional(),
    preferredContact: z.enum(["email", "phone", "text"], {
      required_error: "Please select a preferred contact method",
    }),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
  goals: z.object({
    financialGoals: z.string().min(1, "Please describe your financial goals"),
    challenges: z.string().min(1, "Please describe your challenges"),
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
});

export type ProspectFormPaths =
  | `contact.${keyof ProspectFormData["contact"]}`
  | `goals.${keyof ProspectFormData["goals"]}`
  | `services.${keyof ProspectFormData["services"]}`
  | `budget.${keyof ProspectFormData["budget"]}`;

export type ProspectFormData = z.infer<typeof prospectSchema>;
