import { FormikField } from "@/utils/interface/FormikField";
import { Passwordfield } from "@/components/custom/PasswordField";


export const LoginFields: FormikField = {
  submitBtn: "Connecter",
  data: [
    {
      label: "Username",
      name: "username",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Password",
      name: "password",
      type: "custom",
      autocomplete: "off",
      render: Passwordfield,
    },
  ],
};
