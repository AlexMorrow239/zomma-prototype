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

export const mockProspects: Prospect[] = [
  mockProspect,
  {
    id: "mock-prospect-2",
    contacted: true,
    createdAt: "2024-03-19T15:30:00Z",
    updatedAt: "2024-03-21T09:15:00Z",
    contact: {
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@techstart.io",
      phone: "(555) 987-6543",
      businessName: "TechStart Solutions",
      preferredContact: "phone",
    },
    goals: {
      financialGoals:
        "Seeking to scale operations and need financial guidance for expansion.",
      challenges:
        "Rapid growth causing accounting complexity and need help with financial forecasting.",
    },
    services: {
      selectedServices: ["CFO Services", "Financial Advisory", "Tax Planning"],
    },
    budget: {
      budgetRange: "25k-50k",
    },
  },
  {
    id: "mock-prospect-3",
    contacted: false,
    createdAt: "2024-03-21T08:45:00Z",
    updatedAt: "2024-03-21T08:45:00Z",
    contact: {
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@greenleaf.com",
      phone: "(555) 234-5678",
      businessName: "GreenLeaf Organics",
      preferredContact: "email",
    },
    goals: {
      financialGoals:
        "Need assistance with inventory management and profit optimization.",
      challenges:
        "Seasonal business fluctuations and inventory tracking issues.",
    },
    services: {
      selectedServices: [
        "Bookkeeping",
        "Inventory Management",
        "Business Advisory",
      ],
    },
    budget: {
      budgetRange: "5k-10k",
    },
  },
];
