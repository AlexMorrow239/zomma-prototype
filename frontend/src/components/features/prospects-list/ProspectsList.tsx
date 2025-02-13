import { useProspectStore } from "@/stores/prospectStore";
import { Prospect } from "@/types";

import "./ProspectsList.scss";

interface ProspectsListProps {
  prospects: Prospect[];
}

export function ProspectsList({ prospects }: ProspectsListProps) {
  const { selectedProspect, setSelectedProspect } = useProspectStore();

  return (
    <div className="prospects-list">
      {prospects.length === 0 ? (
        <div className="no-prospects">No prospects found</div>
      ) : (
        prospects.map((prospect) => (
          <div
            key={prospect.id}
            className={`prospect-item ${
              selectedProspect?.id === prospect.id ? "selected" : ""
            }`}
            onClick={() => setSelectedProspect(prospect)}
          >
            <h3>
              {prospect.contact.businessName ||
                `${prospect.contact.name.firstName} ${prospect.contact.name.lastName}`}
            </h3>
            <p>{prospect.contact.email}</p>
            <span
              className={`status ${prospect.status === "contacted" ? "contacted" : "new"}`}
            >
              {prospect.status === "contacted" ? "Contacted" : "New"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
