import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useApiMutation } from "@/hooks/useApi";
import { useLoadingStore } from "@/stores/loadingStore";
import { useUIStore } from "@/stores/uiStore";

import type { ProspectFormData } from "./schema";
import { prospectSchema } from "./schema";

type ProspectApiRequest = {
  contact: {
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
    phone: string;
    preferredContact: "email" | "phone" | "text";
    businessName?: string;
  };
  goals: {
    financialGoals: string;
    challenges: string;
  };
  services: {
    selectedServices: string[];
  };
  budget: {
    budgetRange: string;
  };
};

type NestedPaths =
  | keyof ProspectFormData
  | `contact.${keyof ProspectFormData["contact"]}`
  | `goals.${keyof ProspectFormData["goals"]}`
  | `services.${keyof ProspectFormData["services"]}`
  | `budget.${keyof ProspectFormData["budget"]}`;

export const useProspectForm = (): {
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

  const setLoading = useLoadingStore((state) => state.setLoading);
  const addToast = useUIStore((state) => state.addToast);

  const createProspectMutation = useApiMutation<any, ProspectApiRequest>(
    "/prospects",
    {
      method: "POST",
    }
  );

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
      setLoading(true);
      const formattedData: ProspectApiRequest = {
        contact: {
          name: {
            firstName: data.contact.firstName,
            lastName: data.contact.lastName,
          },
          email: data.contact.email,
          phone: data.contact.phone,
          preferredContact: data.contact.preferredContact,
          ...(data.contact.businessName && {
            businessName: data.contact.businessName,
          }),
        },
        goals: {
          financialGoals: data.goals.financialGoals,
          challenges: data.goals.challenges,
        },
        services: {
          selectedServices: data.services.selectedServices,
        },
        budget: {
          budgetRange: data.budget.budgetRange,
        },
      };

      await createProspectMutation.mutateAsync(formattedData);
      addToast({
        type: "success",
        message: "Your questionnaire has been submitted successfully!",
      });
      handleReset();
    } catch (error) {
      console.error("Error in submission:", error);
      addToast({
        type: "error",
        message: "Failed to submit questionnaire. Please try again.",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
      setLoading(false);
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
