import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import type { ProspectFormData } from "./schema";
import { prospectSchema } from "./schema";

type NestedPaths =
  | keyof ProspectFormData
  | `contact.${keyof ProspectFormData["contact"]}`
  | `goals.${keyof ProspectFormData["goals"]}`
  | `services.${keyof ProspectFormData["services"]}`
  | `budget.${keyof ProspectFormData["budget"]}`;

export const useProspectForm = (
  onSubmit: (data: ProspectFormData) => Promise<void>
): {
  form: UseFormReturn<ProspectFormData>;
  currentStep: number;
  isSubmitting: boolean;
  handleNextStep: () => Promise<boolean>;
  handlePreviousStep: () => void;
  handleReset: () => void;
  handleSubmit: (data: ProspectFormData) => Promise<void>;
} => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProspectFormData>({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      contact: {
        firstName: "",
        lastName: "",
        businessName: "",
        preferredContact: "email",
        email: "",
        phone: "",
      },
      goals: {
        financialGoals: "",
        challenges: "",
      },
      services: {
        selectedServices: [],
      },
      budget: {
        budgetRange: "",
      },
    },
  });

  const handleNextStep = async (): Promise<boolean> => {
    let fieldsToValidate: NestedPaths[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "contact.firstName",
          "contact.lastName",
          "contact.email",
          "contact.phone",
          "contact.preferredContact",
        ];
        break;
      case 2:
        fieldsToValidate = ["goals.financialGoals", "goals.challenges"];
        break;
      case 3:
        fieldsToValidate = ["services.selectedServices"];
        break;
    }

    const isStepValid = await form.trigger(fieldsToValidate);

    if (isStepValid && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return isStepValid;
  };

  const handlePreviousStep = (): void => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = (): void => {
    setCurrentStep(1);
    form.reset();
  };

  const handleSubmit = async (data: ProspectFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      handleReset();
    } catch (error) {
      console.error("Error in submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    isSubmitting,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSubmit,
  };
};
