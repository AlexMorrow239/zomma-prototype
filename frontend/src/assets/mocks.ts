import { ProspectFormData } from "@/pages/prospect-questionnaire/schema";

export const mockProspect: ProspectFormData = {
  contact: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    businessName: "Acme Corporation",
    preferredContact: "email",
  },
  goals: {
    financialGoals:
      "Looking to improve cash flow and establish better financial planning processes.",
    challenges:
      "Currently struggling with manual bookkeeping and need help with tax planning.",
  },
  services: {
    selectedServices: ["Bookkeeping", "Tax Planning", "Financial Advisory"],
  },
  budget: {
    budgetRange: "10k-25k",
  },
};
