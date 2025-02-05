import { UseFormReturn } from "react-hook-form";

import { FormField } from "@/components/common/form-field/FormField";

import { ProspectFormData } from "../../schema";

interface ContactStepProps {
  form: UseFormReturn<ProspectFormData>;
  errors: any;
}

export default function ContactStep({ form, errors }: ContactStepProps) {
  return (
    <div className="section active">
      <h2>Contact Information</h2>
      <div className="grid-container">
        <FormField
          formType="prospect"
          form={form}
          label="First Name"
          name="contact.firstName"
          type="text"
          required
          error={errors.contact?.firstName?.message}
        />
        <FormField
          formType="prospect"
          form={form}
          label="Last Name"
          name="contact.lastName"
          type="text"
          required
          error={errors.contact?.lastName?.message}
        />
        <FormField
          formType="prospect"
          form={form}
          label="Email"
          name="contact.email"
          type="email"
          required
          error={errors.contact?.email?.message}
        />
        <FormField
          formType="prospect"
          form={form}
          label="Phone"
          name="contact.phone"
          type="tel"
          required
          error={errors.contact?.phone?.message}
        />
        <FormField
          formType="prospect"
          form={form}
          label="Preferred Contact Method"
          name="contact.preferredContact"
          type="select"
          required
          error={errors.contact?.preferredContact?.message}
          options={[
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
            { value: "text", label: "Text Message" },
          ]}
        />
        <FormField
          formType="prospect"
          form={form}
          label="Business Name"
          name="contact.businessName"
          type="text"
          required={false}
          error={errors.contact?.companyName?.message}
        />
      </div>
    </div>
  );
}
