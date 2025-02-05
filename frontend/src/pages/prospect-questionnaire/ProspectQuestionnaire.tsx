import { useState } from "react";
import "./Prospectquestionnaire.scss";
import { ProspectFormData } from "./schema";
import { useProspectForm } from "./useProspectForm";
import ContactStep from "./components/contact-step/ContactStep";
import GoalsStep from "./components/goals-step/GoalsStep";
import ServicesStep from "./components/service-step/ServiceStep";
import BudgetStep from "./components/budget-step/BudgetStep";

const services = [
  {
    id: "tax",
    name: "Tax Compliance",
    description: "Tax preparation and planning services",
  },
  {
    id: "estate",
    name: "Estate Planning",
    description: "Comprehensive estate planning solutions",
  },
  {
    id: "business",
    name: "Business Consulting",
    description: "Strategic business advice and planning",
  },
  {
    id: "audit",
    name: "Audit Services",
    description: "Financial audit and assurance services",
  },
  {
    id: "financial",
    name: "Financial Planning",
    description: "Personal and business financial planning",
  },
  {
    id: "bookkeeping",
    name: "Bookkeeping",
    description: "Regular bookkeeping and accounting services",
  },
];

export default function ProspectQuestionnaire() {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: ProspectFormData): Promise<void> => {
    console.log("Form submitted:", data);
    setSubmitSuccess(true);
  };

  const {
    form,
    currentStep,
    isSubmitting,
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
  } = useProspectForm(onSubmit);

  const {
    formState: { errors },
    watch,
    setValue,
  } = form;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ContactStep form={form} errors={errors} />;
      case 2:
        return <GoalsStep form={form} errors={errors} />;
      case 3:
        return (
          <ServicesStep
            form={form}
            errors={errors}
            watch={watch}
            setValue={setValue}
            services={services}
          />
        );
      case 4:
        return <BudgetStep form={form} errors={errors} />;
      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="questionnaire">
        <div className="success-message">
          <h2>Thank You!</h2>
          <p>
            Your questionnaire has been submitted successfully. A ZOMMA
            representative will contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire">
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <div className="form-header">
          <div className="progress-sections">
            {["Contact", "Goals", "Services", "Budget"].map((section, index) => (
              <div
                key={section}
                className={`progress-section ${
                  currentStep === index + 1 ? "active" : ""
                }`}
              >
                <span className="section-number">{index + 1}</span>
                <span className="section-title">{section}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-content">
          <h1>ZOMMA Group Prospective Client Questionnaire</h1>
          {renderCurrentStep()}
        </div>

        <div className="form-footer">
          <div className="button-group">
            {currentStep > 1 && (
              <button
                type="button"
                className="secondary"
                onClick={handlePreviousStep}
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}

            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <span className="button__content">
                    <span className="spinner" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Questionnaire"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}