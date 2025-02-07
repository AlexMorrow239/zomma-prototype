import { ReactElement, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/button/Button";
import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";

import { RegistrationForm, registrationSchema } from "@/schemas/userSchemas";
import { useAuthStore } from "@/stores/authStore";
import { User } from "@/types";

import "./Registration.scss";

export default function Registration(): ReactElement {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: RegistrationForm): Promise<void> => {
    setIsLoading(true);
    try {
      // Accept any valid input for development
      console.log("Development mode - auto-accepting registration:", data);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set mock auth data
      useAuthStore.getState().setAuth(
        {
          id: "1",
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        } as User,
        "mock-token"
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
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
              name="firstName"
              label="First Name"
              type="text"
              required={true}
            />

            <FormField
              formType="generic"
              form={form}
              name="lastName"
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
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
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
