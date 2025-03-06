import { JSX } from "react";

// export interface IField {
//   label: string;
//   name: string;
//   type:
//     | "text"
//     | "date"
//     | "number"
//     | "file"
//     | "radio"
//     | "select"
//     | "custom"
//     | "password"
//     | "time"
//     | "checkbox";
//   autocomplete: "" | "off";
//   step?: string;
//   options?: { label: string; value: string }[];
//   render?: (formik: any, fieldName: string) => JSX.Element;
// }

// export interface FormikField {
//   submitBtn: string;
//   data: IField[];
// }
import { Passwordfield } from "@/components/custom/PasswordField";
import { Check_db_field } from "@/components/custom/CheckDbField";

export interface IField {
  label: any;
  name: string;
  type:
    | "text"
    | "date"
    | "number"
    | "file"
    | "radio"
    | "select"
    | "custom"
    | "password"
    | "check_db"
    | "time"
    | "checkbox";
  autocomplete?: "" | "off";
  step?: string;
  options?: { label: string; value: string }[];
  render?: (formik: any, fieldName: string) => JSX.Element;
}

export interface FormikField {
  submitBtn: any;
  data: IField[];
}

// ✅ Helper function to assign render components
const getRenderComponent = (type: IField["type"]) => {
  if (type === "password") return Passwordfield;
  if (type === "check_db") return Check_db_field;
  return undefined;
};

// ✅ Class to create form fields dynamically
export class FormField implements FormikField {
  submitBtn: any;
  data: IField[];

  constructor(submitBtn: string, fields: { label: string; name: string; type: IField["type"] }[]) {
    this.submitBtn = submitBtn;
    this.data = fields.map((field) => ({
      ...field,
      autocomplete: "off", // Default autocomplete setting
      render: getRenderComponent(field.type), // Dynamically assign render component
    }));
  }
}

