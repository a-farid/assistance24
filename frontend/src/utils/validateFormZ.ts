import { ZodError } from "zod";
// test
export const validateForm = (values: any, schema: any) => {
  try {
    console.log('values', values);
    schema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("Error", error.formErrors.fieldErrors);
      return error.formErrors.fieldErrors;
    }
  }
};
