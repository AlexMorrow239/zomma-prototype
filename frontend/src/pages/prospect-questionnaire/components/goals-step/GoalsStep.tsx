import { UseFormReturn } from "react-hook-form";

import { FormField } from "@/components/common/form-field/FormField";

import { ProspectFormData } from "../../schema";

interface GoalsStepProps {
  form: UseFormReturn<ProspectFormData>;
  errors: any;
}

export default function GoalsStep({ form, errors }: GoalsStepProps) {
  return (
    <div className="section active">
      <h2>Financial Goals</h2>
      <p className="section-description">
        Help us understand your financial objectives and challenges.
      </p>

      <FormField
        formType="prospect"
        form={form}
        label="What are your primary financial objectives for the next 1-3 years?"
        name="goals.financialGoals"
        type="textarea"
        required
        rows={4}
        error={errors.goals?.financialGoals?.message}
      />

      <FormField
        formType="prospect"
        form={form}
        label="What financial challenges are you currently facing?"
        name="goals.challenges"
        type="textarea"
        required
        rows={4}
        error={errors.goals?.challenges?.message}
      />
    </div>
  );
}
