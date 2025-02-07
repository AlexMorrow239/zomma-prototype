import { ReactElement, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/button/Button";
import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";

import { LoginForm, loginSchema } from "@/schemas/userSchemas";
import { useAuthStore } from "@/stores/authStore";

import "./Login.scss";

export default function Login(): ReactElement {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: LoginForm): Promise<void> => {
    setIsLoading(true);
    try {
      // Accept any valid input for development
      console.log("Development mode - auto-accepting valid credentials:", data);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set mock auth data
      useAuthStore.getState().setAuth(
        {
          id: "1",
          email: data.email,
          firstName: "Test",
          lastName: "User",
        },
        "mock-token"
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Partener Login</h1>
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
            isLoading={isLoading}
            disabled={isLoading}
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
