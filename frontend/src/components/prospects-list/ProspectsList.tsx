import { Prospect } from "@/types";

import "./ProspectsList.scss";

interface ProspectsListProps {
  prospects: Prospect[];
  selectedProspect: Prospect;
  onSelectProspect: (prospect: Prospect) => void;
}

export function ProspectsList({
  prospects,
  selectedProspect,
  onSelectProspect,
}: ProspectsListProps) {
  return (
    <div className="prospects-list">
      {prospects.map((prospect) => (
        <div
          key={prospect.id}
          className={`prospect-item ${
            selectedProspect.id === prospect.id ? "selected" : ""
          }`}
          onClick={() => onSelectProspect(prospect)}
        >
          <h3>{prospect.contact.businessName}</h3>
          <p>
            {prospect.contact.firstName} {prospect.contact.lastName}
          </p>
          <span
            className={`status ${prospect.contacted ? "contacted" : "new"}`}
          >
            {prospect.contacted ? "Contacted" : "New"}
          </span>
        </div>
      ))}
    </div>
  );
}
