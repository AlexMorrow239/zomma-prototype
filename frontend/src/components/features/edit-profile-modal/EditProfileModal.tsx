import { type ReactElement } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/button/Button";
import { FormField } from "@/components/common/form-field/FormField";
import { Modal } from "@/components/common/modal/Modal";

import { EditProfileForm, editProfileSchema } from "@/schemas/userSchemas";
import type { User } from "@/types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditProfileForm) => void;
  initialData: User;
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditProfileModalProps): ReactElement {
  const form = useForm<EditProfileForm>({
    defaultValues: initialData,
    resolver: zodResolver(editProfileSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form">
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-profile-form" onSubmit={handleSubmit}>
        <FormField<EditProfileForm>
          formType="generic"
          label="First Name"
          name="name.firstName"
          form={form}
          required
        />
        <FormField<EditProfileForm>
          formType="generic"
          label="Last Name"
          name="name.lastName"
          form={form}
          required
        />
        <FormField<EditProfileForm>
          formType="generic"
          label="Email"
          name="email"
          type="email"
          form={form}
          required
        />
      </form>
    </Modal>
  );
}
