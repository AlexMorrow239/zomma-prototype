import { Prospect } from "@/types";

export const mockProspect: Prospect = {
  id: "mock-prospect-1",
  contacted: false,
  createdAt: "2024-03-20T12:00:00Z",
  updatedAt: "2024-03-20T12:00:00Z",
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
