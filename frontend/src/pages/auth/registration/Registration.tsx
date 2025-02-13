import { ReactElement } from "react";

import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/button/Button";
import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";

import { useApiMutation } from "@/hooks/useApi";
import { RegistrationForm, registrationSchema } from "@/schemas/userSchemas";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { AuthResponse } from "@/types";
import { handleError } from "@/utils/errorHandler";

import "./Registration.scss";

export default function Registration(): ReactElement {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Set up mutation for registration
  const registerMutation = useApiMutation<
    AuthResponse,
    Omit<RegistrationForm, "confirmPassword">
  >("/auth/register", {
    onSuccess: (data) => {
      // Use the destructured setAuth instead of accessing through getState()
      setAuth(data.user, data.token);

      addToast({
        type: "success",
        message: "Registration successful! Welcome aboard.",
      });

      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("[Registration] Mutation error:", error);
      handleError(error);
    },
  });

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: RegistrationForm): Promise<void> => {
    const { confirmPassword, ...registrationData } = data;

    try {
      registerMutation.mutateAsync(registrationData);
    } catch (error) {
      console.error("[Registration] Error in onSubmit:", error);
    }
  };

  return (
    <div className="registration">
      <div className="registration__container">
        <h1 className="registration__title">Create Account</h1>
        <p className="registration__subtitle">
          Create your partner account here
        </p>

        <form
          className="registration__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-section">
            <FormField
              formType="generic"
              form={form}
              name="name.firstName"
              label="First Name"
              type="text"
              required={true}
            />

            <FormField
              formType="generic"
              form={form}
              name="name.lastName"
              label="Last Name"
              type="text"
              required={true}
            />

            <FormField
              formType="generic"
              form={form}
              name="email"
              label="Email Address"
              type="email"
              placeholder="username@example.com"
              autocomplete="username"
              required={true}
            />

            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Create a password"
            />

            <PasswordField
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
            />
            <PasswordField
              form={form}
              name="adminPassword"
              label="Admin Password"
              placeholder="Enter admin password"
              help="Required for account creation"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            Create Account
          </Button>

          <div className="registration__footer">
            <p>
              Already have an account?{" "}
              <Link to="/auth/login">Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
