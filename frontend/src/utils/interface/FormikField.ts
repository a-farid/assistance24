export interface IField {
  label: string;
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
    | "time"
    | "checkbox";
  autocomplete: "" | "off";
  step?: string;
  options?: { label: string; value: string }[];
  render?: (formik: any, fieldName: string) => JSX.Element;
}

export interface FormikField {
  submitBtn: string;
  data: IField[];
}
