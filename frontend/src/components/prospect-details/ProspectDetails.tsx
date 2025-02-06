import { ProspectFormData } from "@/pages/prospect-questionnaire/schema";

import "./ProspectDetails.scss";

interface ProspectDetailsProps {
  prospect: ProspectFormData;
}

export function ProspectDetails({ prospect }: ProspectDetailsProps) {
  const getBudgetRangeLabel = (value: string): string => {
    const budgetRanges: Record<string, string> = {
      below5k: "Below $5,000",
      "5k-10k": "$5,000 - $10,000",
      "10k-25k": "$10,000 - $25,000",
      "25k-50k": "$25,000 - $50,000",
      above50k: "Above $50,000",
    };
    return budgetRanges[value] || value;
  };

  return (
    <div className="prospect-details">
      <section className="details-section">
        <h2>Contact Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Name</span>
            <span className="value">
              {prospect.contact.firstName} {prospect.contact.lastName}
            </span>
          </div>
          {prospect.contact.businessName && (
            <div className="detail-item">
              <span className="label">Business Name</span>
              <span className="value">{prospect.contact.businessName}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="label">Email</span>
            <span className="value">{prospect.contact.email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Phone</span>
            <span className="value">{prospect.contact.phone}</span>
          </div>
          <div className="detail-item">
            <span className="label">Preferred Contact</span>
            <span className="value">
              {prospect.contact.preferredContact.charAt(0).toUpperCase() +
                prospect.contact.preferredContact.slice(1)}
            </span>
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2>Goals & Challenges</h2>
        <div className="details-stack">
          <div className="detail-item">
            <span className="label">Financial Goals</span>
            <p className="value text-block">{prospect.goals.financialGoals}</p>
          </div>
          <div className="detail-item">
            <span className="label">Current Challenges</span>
            <p className="value text-block">{prospect.goals.challenges}</p>
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2>Services of Interest</h2>
        <div className="services-list">
          {prospect.services.selectedServices.map((service) => (
            <span key={service} className="service-tag">
              {service}
            </span>
          ))}
        </div>
      </section>

      <section className="details-section">
        <h2>Budget Information</h2>
        <div className="detail-item">
          <span className="label">Expected Budget Range</span>
          <span className="value">
            {getBudgetRangeLabel(prospect.budget.budgetRange)}
          </span>
        </div>
      </section>
    </div>
  );
}
