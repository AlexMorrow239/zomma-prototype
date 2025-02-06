import { ReactElement, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";

import { useAuthStore } from "@/stores/authStore";

import "./Login.scss";

// Define the form validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type loginForm = z.infer<typeof loginSchema>;

export default function Login(): ReactElement {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<loginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: loginForm): Promise<void> => {
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

          <button
            type="submit"
            className="button button--primary button--full-width"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

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
