import { Check_db_field } from "@/components/custom/CheckDbField";
import { Passwordfield } from "@/components/custom/PasswordField";
import { FormikField } from "@/utils/interface/FormikField";


export const SignupFields: FormikField = {
  submitBtn: "Sign Up",
  data: [
    {
      label: "Username",
      name: "username",
      type: "custom",
      autocomplete: "off",
      render: Check_db_field,
    },
    {
      label: "Password",
      name: "hashed_password",
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
    },
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
      label: "Email",
      name: "email",
      type: "custom",
      autocomplete: "off",
      render: Check_db_field,
    },
    {
      label: "Phone",
      name: "phone",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Adress",
      name: "adress",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Admin Key",
      name: "admin_key",
      type: "text",
      autocomplete: "off",
    },
  ],
};


// {
//   label: "Departement",
//   name: "departement",
//   type: "select",
//   autocomplete: "off",
//   options: [
//     { label: "Informatique", value: "Informatique" },
//     { label: "Electrique", value: "Electrique" },
//     { label: "Mecanique", value: "Mecanique" },
//     { label: "Civil", value: "Civil" },
//     { label: "Telecom", value: "Telecom" },
//     { label: "Industriel", value: "Industriel" },
//   ],
// },

