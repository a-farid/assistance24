"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FormError from "@/components/custom/FormError";
import Button from "@mui/material/Button";
import Loading from "@/components/custom/Loading";
import { validateForm } from "@/utils/validateFormZ";
import { z } from "zod";
import { IField } from "@/utils/interface/FormikField";
import { ReactNode } from "react";

type Props = {
  initialValues: any;
  formSchema: any;
  onSubmit: any;
  fields: any;
  isLoading: boolean;
  children?: ReactNode;

};

const CustomFormik = ({initialValues,formSchema,onSubmit,fields,isLoading,children
}: Props) => {
  type FormValues = z.infer<typeof formSchema>;

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validate={(values) => validateForm(values, formSchema)}
      onSubmit={onSubmit}
      validateOnMount
    >
      {(formik) => {
        return (
          <>{children}
          <Form>
            {fields.data.map((field: IField, index: number) => (
              <div
                key={index}
                className="w-full grid grid-cols-3 my-5 relative"
              >
                <label
                  htmlFor={field.name}
                  className="col-span-1 font-bold p-2"
                >
                  {field.label}
                </label>
                <>
                  {(() => {
                    switch (field.type) {
                      case "select":
                        return (
                          <>
                            <Field
                              className="col-span-2 font-bold p-2 border w-full"
                              autoComplete={field.autocomplete}
                              as={field.type}
                              type={field.type}
                              id={field.name}
                              name={field.name}
                            >
                              <option
                                key="{index}"
                                value=""
                                className="px-auto bg-red-500"
                              >
                                ------Selectionner-------
                              </option>
                              {field.options &&
                                field.options.map((op, index) => (
                                  <option key={index} value={op.value}>
                                    {op.label}
                                  </option>
                                ))}
                            </Field>
                            <div></div>
                            <div className="col-span-2 grid">
                              <ErrorMessage
                                name={field.name}
                                component={FormError}
                                className="absolute top-0 right-0 col-span-3"
                              />
                            </div>
                          </>
                        );
                      case "radio":
                        return (
                          <>
                            <div className="col-span-2 flex items-center justify-start gap-2">
                              {field.options &&
                                field.options.map((op, index) => (
                                  <label
                                    key={index}
                                    className="text-center mx-[2px]"
                                  >
                                    <Field
                                      className="mx-auto"
                                      type={field.type}
                                      id={field.name}
                                      name={field.name}
                                      value={op.value}
                                    />
                                    <span className="ml-[2px]">{op.label}</span>
                                  </label>
                                ))}
                            </div>
                            <div></div>
                            <div className="col-span-2 grid">
                              <ErrorMessage
                                name={field.name}
                                component={FormError}
                                className="absolute top-0 right-0 col-span-3"
                              />
                            </div>
                          </>
                        );
                      case "file":
                        return (
                          <>
                            <input
                              className="col-span-2 font-bold p-2 border w-full"
                              autoComplete={field.autocomplete}
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              onChange={(event: any) => {
                                formik.setFieldValue(
                                  field.name,
                                  event.currentTarget.files[0]
                                );
                              }}
                            />
                            <div></div>
                            <div className="col-span-2 grid">
                              <ErrorMessage
                                name={field.name}
                                component={FormError}
                                className="absolute top-0 right-0 col-span-3"
                              />
                            </div>
                          </>
                        );
                      case "number":
                      case "checkbox":
                      case "date":
                      case "password":
                      case "time":
                      case "text":
                        return (
                          <>
                            <Field
                              className="col-span-2 font-bold p-2 border w-full"
                              autoComplete={field.autocomplete}
                              as={"input"}
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              step="1"
                            />
                            <div></div>
                            <div className="col-span-2 grid">
                              <ErrorMessage
                                name={field.name}
                                component={FormError}
                                className="absolute top-0 right-0 col-span-3"
                              />
                            </div>
                          </>
                        );
                      case "custom":
                        return field.render
                          ? field.render(formik, field.name)
                          : null;
                      default:
                        return <h1>Please choose a valid field type</h1>;
                    }
                  })()}
                </>
              </div>
            ))}
            <div className="w-full flex items-center justify-center">
              {isLoading ? (
                <div>
                  <Loading />
                </div>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  className="my-3 mx-auto bg-slate-500 w-full"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {fields.submitBtn}
                </Button>
              )}
            </div>
          </Form>
          </>

        );
      }}
    </Formik>
  );
};

export default CustomFormik;
1;
