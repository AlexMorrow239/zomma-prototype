import type { UseFormReturn, Path } from "react-hook-form";

import "./FormField.scss";
import { ReactElement } from "react";

interface FormFieldProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  form?: UseFormReturn<T>;
  type?: "text" | "textarea" | "select" | "number" | "email";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  help?: string;
  disabled?: boolean;
  rows?: number;
  autocomplete?: string;
}

export function FormField<T extends Record<string, unknown>>({
  label,
  name,
  form,
  type = "text",
  required = false,
  placeholder,
  options,
  help,
  disabled = false,
  rows,
  autocomplete,
}: FormFieldProps<T>): ReactElement {
  const error = form?.formState?.errors[name];
  const inputClassName = `form-field__input ${error ? "form-field__input--error" : ""}`;

  return (
    <div className="form-field">
      <label className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      {options ? (
        <select
          {...form?.register(name)}
          className={inputClassName}
          disabled={disabled}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          {...form?.register(name)}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <input
          {...form?.register(name)}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autocomplete}
        />
      )}
      {help && <span className="form-field__help">{help}</span>}
      {error && (
  <span className="form-field__error">
    {error.message?.toString() || 'Invalid input'}
  </span>
)}
    </div>
  );
}