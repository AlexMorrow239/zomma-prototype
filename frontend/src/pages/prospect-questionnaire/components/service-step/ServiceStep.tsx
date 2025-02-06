import { CheckSquare } from "lucide-react";

import "./ServiceStep.scss";

interface ServicesStepProps {
  errors: any;
  watch: any;
  setValue: any;
  services: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export default function ServicesStep({
  errors,
  watch,
  setValue,
  services,
}: ServicesStepProps) {
  const handleServiceSelection = (serviceId: string) => {
    const currentServices = watch("services.selectedServices") || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter((id: string) => id !== serviceId)
      : [...currentServices, serviceId];
    setValue("services.selectedServices", newServices, {
      shouldValidate: true,
    });
  };

  return (
    <div className="section active">
      <h2>Services of Interest</h2>
      <p className="section-description">
        Select the services you're interested in discussing with our team.
      </p>
      <div
        className={`services-grid ${errors.services?.selectedServices ? "has-error" : ""}`}
      >
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-item ${
              watch("services.selectedServices")?.includes(service.id)
                ? "selected"
                : ""
            }`}
            onClick={() => handleServiceSelection(service.id)}
          >
            <div className="service-content">
              <CheckSquare
                className={
                  watch("services.selectedServices")?.includes(service.id)
                    ? "selected"
                    : ""
                }
              />
              <div className="service-info">
                <span className="service-name">{service.name}</span>
                <span className="service-description">
                  {service.description}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {errors.services?.selectedServices && (
        <span className="form-field__error">
          {errors.services.selectedServices.message}
        </span>
      )}
      <div className="service-note">
        <p>
          Note: You can select multiple services. Our team will tailor their
          response based on your selections.
        </p>
      </div>
    </div>
  );
}
