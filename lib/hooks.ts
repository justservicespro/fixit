// lib/hooks.ts
"use client";
import { useState } from "react";
import { isValidEmail, isValidNGPhone } from "@/lib/constants";

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = (
    field: string,
    value: string,
    rules: { required?: boolean; email?: boolean; phone?: boolean; minLength?: number }
  ) => {
    let error = "";
    if (rules.required && !value.trim()) error = "This field is required";
    else if (rules.email && value && !isValidEmail(value)) error = "Enter a valid email address";
    else if (rules.phone && value && !isValidNGPhone(value)) error = "Enter a valid phone number (e.g. 0801 234 5678)";
    else if (rules.minLength && value.length < rules.minLength) error = `Must be at least ${rules.minLength} characters`;
    setErrors((e) => ({ ...e, [field]: error }));
    return !error;
  };
  const clearError = (field: string) => setErrors((e) => ({ ...e, [field]: "" }));
  return { errors, validate, clearError };
};
