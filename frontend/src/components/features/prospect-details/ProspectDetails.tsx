import { Button } from "@/components/common/button/Button";

import { useApiMutation } from "@/hooks/useApi";
import { useProspectStore } from "@/stores/prospectStore";
import { Prospect } from "@/types";

import "./ProspectDetails.scss";

interface ProspectDetailsProps {
  onProspectDeleted?: () => Promise<void>;
}

export function ProspectDetails({ onProspectDeleted }: ProspectDetailsProps) {
  const {
    selectedProspect,
    setSelectedProspect,
    updateProspect,
    removeProspect,
  } = useProspectStore();

  const updateStatusMutation = useApiMutation<Prospect, { status: string }>(
    `/prospects/${(selectedProspect as NonNullable<typeof selectedProspect>)._id}`,
    {
      method: "PUT",
      onSuccess: (updatedProspect) => {
        setSelectedProspect(updatedProspect);
        updateProspect(updatedProspect);
      },
    }
  );

  const deleteProspectMutation = useApiMutation<{ message: string }, void>(
    `/prospects/${(selectedProspect as NonNullable<typeof selectedProspect>)._id}`,
    {
      method: "DELETE",
      onSuccess: async () => {
        removeProspect(selectedProspect!._id);
        setSelectedProspect(null);
        await onProspectDeleted?.();
      },
    }
  );

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

  if (!selectedProspect) return null;

  const handleStatusToggle = () => {
    const newStatus =
      selectedProspect.status === "contacted" ? "pending" : "contacted";
    updateStatusMutation.mutate({ status: newStatus });
  };

  return (
    <div className="prospect-details">
      <div className="prospect-header">
        <div className="contact-status">
          <span
            className={`status-indicator ${
              selectedProspect.status === "contacted"
                ? "contacted"
                : "not-contacted"
            }`}
          >
            {selectedProspect.status === "contacted"
              ? "Contacted"
              : "Not Contacted"}
          </span>

          <div className="actions">
            <Button
              variant="primary"
              onClick={handleStatusToggle}
              isLoading={updateStatusMutation.isPending}
            >
              {selectedProspect.status === "contacted"
                ? "Mark as Not Contacted"
                : "Mark as Contacted"}
            </Button>

            <Button
              variant="outline"
              onClick={() => deleteProspectMutation.mutate()}
              isLoading={deleteProspectMutation.isPending}
            >
              Delete Prospect
            </Button>
          </div>
        </div>
      </div>

      <section className="details-section">
        <h2>Contact Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Name</span>
            <span className="value">
              {selectedProspect.contact.name.firstName}{" "}
              {selectedProspect.contact.name.lastName}
            </span>
          </div>
          {selectedProspect.contact.businessName && (
            <div className="detail-item">
              <span className="label">Business Name</span>
              <span className="value">
                {selectedProspect.contact.businessName}
              </span>
            </div>
          )}
          <div className="detail-item">
            <span className="label">Email</span>
            <span className="value">{selectedProspect.contact.email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Phone</span>
            <span className="value">{selectedProspect.contact.phone}</span>
          </div>
          <div className="detail-item">
            <span className="label">Preferred Contact</span>
            <span className="value">
              {selectedProspect.contact.preferredContact
                .charAt(0)
                .toUpperCase() +
                selectedProspect.contact.preferredContact.slice(1)}
            </span>
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2>Goals & Challenges</h2>
        <div className="details-stack">
          <div className="detail-item">
            <span className="label">Financial Goals</span>
            <p className="value text-block">
              {selectedProspect.goals.financialGoals}
            </p>
          </div>
          <div className="detail-item">
            <span className="label">Current Challenges</span>
            <p className="value text-block">
              {selectedProspect.goals.challenges}
            </p>
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2>Services of Interest</h2>
        <div className="services-list">
          {selectedProspect.services.selectedServices.map((service) => (
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
            {getBudgetRangeLabel(selectedProspect.budget.budgetRange)}
          </span>
        </div>
      </section>
    </div>
  );
}
