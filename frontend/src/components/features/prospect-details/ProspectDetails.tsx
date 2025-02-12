import { Button } from "@/components/common/button/Button";

import { useUIStore } from "@/stores/uiStore";
import { Prospect } from "@/types";

import "./ProspectDetails.scss";

interface ProspectDetailsProps {
  prospect: Prospect;
}

export function ProspectDetails({ prospect }: ProspectDetailsProps) {
  const { addToast } = useUIStore();

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

  const handleMarkContacted = async () => {
    // TODO: Implement once backend is ready
    addToast({
      type: "success",
      message: "Prospect marked as contacted",
    });
    console.log("Mark contacted clicked - Not yet implemented");
  };

  return (
    <div className="prospect-details">
      <div className="prospect-header">
        <div className="contact-status">
          <span
            className={`status-indicator ${prospect.contacted ? "contacted" : "not-contacted"}`}
          >
            {prospect.contacted ? "Contacted" : "Not Contacted"}
          </span>

          {!prospect.contacted && (
            <Button
              variant="primary"
              onClick={handleMarkContacted}
              isLoading={false} // TODO: Use actual loading state once implemented
            >
              Mark as Contacted
            </Button>
          )}
        </div>
      </div>

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
