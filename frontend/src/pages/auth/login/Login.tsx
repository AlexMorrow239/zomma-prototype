import { ReactElement } from "react";

import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/button/Button";
import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";

import { useApiMutation } from "@/hooks/useApi";
import { LoginForm, loginSchema } from "@/schemas/userSchemas";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { AuthResponse } from "@/types";
import { handleError } from "@/utils/errorHandler";

import "./Login.scss";

export default function Login(): ReactElement {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Set up mutation for login
  const loginMutation = useApiMutation<AuthResponse, LoginForm>("/auth/login", {
    onSuccess: (data) => {
      // Use the destructured setAuth instead of accessing through getState()
      setAuth(data.user, data.token);

      addToast({
        type: "success",
        message: "Login successful! Welcome back.",
      });

      navigate("/dashboard");
    },
    onError: handleError, // Simplified error handling
  });

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: LoginForm): Promise<void> => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Partner Login</h1>
        <p className="login__subtitle">Sign in to manage clients</p>

        <form
          className="login__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-section">
            <FormField
              formType="generic"
              form={form}
              name="email"
              label="Email Address"
              type="email"
              placeholder="username@gmail.com"
              autocomplete="username"
              required={true}
            />

            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            Sign In
          </Button>

          <div className="login__footer">
            <p>
              Don't have an account?{" "}
              <Link to="/auth/register">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
