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
        <div key="no-prospects" className="no-prospects">
          No prospects found
        </div>
      ) : (
        prospects.map((prospect) => (
          <div
            key={prospect._id}
            className={`prospect-item ${
              selectedProspect?._id === prospect._id ? "selected" : ""
            }`}
            onClick={() => setSelectedProspect(prospect)}
          >
            <h3>
              {prospect.contact.businessName ||
                `${prospect.contact.name.firstName} ${prospect.contact.name.lastName}`}
            </h3>
            <p>{prospect.contact.email}</p>
            <span
              className={`status ${
                (selectedProspect?._id === prospect._id
                  ? selectedProspect.status
                  : prospect.status) === "contacted"
                  ? "contacted"
                  : "new"
              }`}
            >
              {(selectedProspect?._id === prospect._id
                ? selectedProspect.status
                : prospect.status) === "contacted"
                ? "Contacted"
                : "Not Contacted"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
