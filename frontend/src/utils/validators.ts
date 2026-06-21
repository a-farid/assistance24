import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateForm = (values: any, schema: any) => {
  try {
    // console.log('values', values);
    schema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      // console.log("Error", error.formErrors.fieldErrors);
      return error.formErrors.fieldErrors;
    }
  }
};
