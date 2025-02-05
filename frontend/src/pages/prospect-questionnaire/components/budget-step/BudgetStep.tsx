import { UseFormReturn } from "react-hook-form";

import { FormField } from "@/components/common/form-field/FormField";

import { ProspectFormData } from "../../schema";

interface BudgetStepProps {
  form: UseFormReturn<ProspectFormData>;
  errors: any;
}

export default function BudgetStep({ form, errors }: BudgetStepProps) {
  return (
    <div className="section active">
      <h2>Budget Information</h2>
      <p className="section-description">
        Help us understand your budget expectations to better tailor our
        services to your needs.
      </p>

      <FormField
        formType="prospect"
        form={form}
        label="Expected Annual Budget Range"
        name="budget.budgetRange"
        type="select"
        required
        error={errors.budget?.budgetRange?.message}
        options={[
          { value: "below5k", label: "Below $5,000" },
          { value: "5k-10k", label: "$5,000 - $10,000" },
          { value: "10k-25k", label: "$10,000 - $25,000" },
          { value: "25k-50k", label: "$25,000 - $50,000" },
          { value: "above50k", label: "Above $50,000" },
        ]}
      />
    </div>
  );
}
