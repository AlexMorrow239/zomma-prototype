import { ProspectDetails } from "@/components/prospect-details/ProspectDetails";

import { ProspectFormData } from "@/pages/prospect-questionnaire/schema";

import "./Dashboard.scss";

// Mock data for development - remove once backend is connected
const mockProspect: ProspectFormData = {
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

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Prospect Details</h1>
      </header>
      <main className="dashboard-content">
        <ProspectDetails prospect={mockProspect} />
      </main>
    </div>
  );
}
