import { browserTracingIntegration } from "@sentry/browser";
import * as Sentry from "@sentry/react";

export const initSentry = (): void => {
  if (import.meta.env.VITE_ENV !== "development") {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_ENV,
      integrations: [browserTracingIntegration()],
      tracesSampleRate: 1.0,
    });
  }
};
