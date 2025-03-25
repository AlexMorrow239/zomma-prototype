import { ReactElement } from "react";

import type {
  FieldError,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

import {
  ProspectFormData,
  ProspectFormPaths,
} from "@/pages/prospect-questionnaire/schema";

import "./FormField.scss";

interface BaseFormFieldProps<T> {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: readonly { readonly value: string; readonly label: string }[];
  help?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  rows?: number;
  defaultValue?: T;
  value?: string | number | readonly string[] | boolean;
  autocomplete?: string;
  onChange?: (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
  error?: string;
  className?: string;
  showLabel?: boolean;
}

interface ProspectFormFieldProps extends BaseFormFieldProps<string> {
  formType: "prospect";
  name: ProspectFormPaths;
  form: UseFormReturn<ProspectFormData>;
}

interface GenericFormFieldProps<T extends Record<string, unknown>>
  extends BaseFormFieldProps<PathValue<T, Path<T>>> {
  formType: "generic";
  name: Path<T>;
  form?: UseFormReturn<T>;
}

type FormFieldProps<T extends Record<string, unknown>> =
  | ProspectFormFieldProps
  | GenericFormFieldProps<T>;

export function FormField<T extends Record<string, unknown>>({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  options,
  help,
  min,
  max,
  form,
  disabled = false,
  rows,
  formType,
  defaultValue,
  value,
  autocomplete,
  onChange,
  error: explicitError,
  className,
  showLabel = true,
}: FormFieldProps<T>): ReactElement {
  const errors = form?.formState?.errors;

  const registerField = form
    ? formType === "prospect"
      ? form.register(name)
      : form.register(name, { value: defaultValue })
    : { onChange, name };

  const getError = (): FieldError | undefined => {
    if (!errors) return undefined;

    const parts = name.split(".");
    let currentErrors: any = errors;

    for (const part of parts) {
      if (!currentErrors?.[part]) return undefined;
      currentErrors = currentErrors[part];
    }

    return currentErrors as FieldError;
  };

  const fieldError = getError();
  const errorMessage = explicitError || fieldError?.message;
  const inputClassName = `form-field__input ${errorMessage ? "form-field__input--error" : ""} ${className || ""}`;

  // Special handling for checkbox type
  if (type === "checkbox") {
    return (
      <div className="form-field">
        {showLabel && (
          <label className="form-field__label">
            {label}
            {required && <span className="form-field__required">*</span>}
          </label>
        )}
        <div className="checkbox-wrapper">
          <input
            {...registerField}
            type="checkbox"
            checked={value as boolean}
            className={`form-field__checkbox ${className || ""}`}
            disabled={disabled}
          />
        </div>
        {help && <span className="form-field__help">{help}</span>}
        {errorMessage && (
          <span className="form-field__error">{errorMessage}</span>
        )}
      </div>
    );
  }

  return (
    <div className="form-field">
      {showLabel && (
        <label className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      {options ? (
        <select
          {...registerField}
          className={inputClassName}
          disabled={disabled}
          value={value as string | number | readonly string[]}
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
          {...registerField}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <input
          {...registerField}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          autoComplete={autocomplete}
        />
      )}
      {help && <span className="form-field__help">{help}</span>}
      {errorMessage && (
        <span className="form-field__error">{errorMessage}</span>
      )}
    </div>
  );
}
