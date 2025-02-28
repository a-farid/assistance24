import { FormikField } from "@/utils/interface/FormikField";
import { Passwordfield } from "@/components/custom/PasswordField";


export const ResetPasswordFields: FormikField = {
  submitBtn: "Reset password",
  data: [
    {
      label: "Password",
      name: "password",
      type: "custom",
      autocomplete: "off",
      render: Passwordfield,
    },
    {
      label: "Password Confirm",
      name: "password2",
      type: "custom",
      autocomplete: "off",
      render: Passwordfield,
    }
  ],
};