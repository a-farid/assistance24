import { FormikField } from "@/utils/interface/FormikField";
import { Passwordfield } from "@/components/custom/PasswordField";


export const CreateUserFields_en: FormikField = {
  submitBtn: "Register",
  data: [
    {
      label: "First Name",
      name: "first_name",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Last Name",
      name: "last_name",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Address",
      name: "adress",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Email",
      name: "email",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Username",
      name: "username",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Role",
      name: "role",
      type: "select",
      autocomplete: "off",
      options: [
        { label: "Client", value: "client" },
        { label: "Worker", value: "worker" },
      ],
    },
  ],
};

export const CreateUserFields_de: FormikField = {
  submitBtn: "Registrieren",
  data: [
    {
      label: "Vorname",
      name: "first_name",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Nachname",
      name: "last_name",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Adresse",
      name: "adress",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Telefonnummer",
      name: "phone",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "E-Mail",
      name: "email",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Benutzername",
      name: "username",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Rolle",
      name: "role",
      type: "select",
      autocomplete: "off",
      options: [
        { label: "Kunde", value: "client" },
        { label: "Arbeiter", value: "worker" },
      ],
    },
  ],
};

