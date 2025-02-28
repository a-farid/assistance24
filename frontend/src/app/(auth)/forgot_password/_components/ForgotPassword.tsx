import { FormikField } from "@/utils/interface/FormikField";


export const ResetPasswordFields: FormikField = {
  submitBtn: "Confirmer",
  data: [
    {
      label: "Email",
      name: "email",
      type: "text",
      autocomplete: "off",
    }
  ],
};
