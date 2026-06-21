"use client";
import { Button } from "@mui/material";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import FormError from "@/components/custom/FormError";
import { useSelector } from "react-redux";
import { validateForm } from "@/utils/validators";

type Props = {
  setRoute: (route: string) => void;
};
const signupSchema = z.object({
  activation_code: z.string().min(4).max(4),
});
type FormValues = z.infer<typeof signupSchema>;

const initialValues = { activation_code: "" };

function VerificationForm({ setRoute }: Props) {
  const { token } = useSelector((state: any) => state.auth);
 
  const onSubmit = async ({ activation_code }: FormValues) => {
    try {
      const data = { activation_code, activation_token: token };
      // await activation(data);
    } catch (error) {
      console.error("VerificationFormError", error);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validate={(values) => validateForm(values, signupSchema)}
      onSubmit={onSubmit}
      validateOnMount
    >
      {(formik) => {
        return (
          <Form className="flex items-center justify-center flex-col">
            <div className="w-[70%] grid grid-cols-2 my-5 relative">
              <label
                htmlFor="activation_code"
                className="col-span-1 font-bold p-2 text-[20px"
              >
                Code OTP
              </label>
              <Field
                className="col-span-1 font-bold px-2 border tracking-widest text-[20px] w-full"
                type="text"
                id="activation_code"
                name="activation_code"
                maxLength={4}
              />
              <div className="absolute border-l-2 border-blue-600 top-0 right-[0px] bg-white dark:bg-slate-900 h-full w-5"></div>
              <div className="absolute border-x-2 border-blue-600 top-0 right-[44px] bg-white dark:bg-slate-900 h-full w-2"></div>
              <div className="absolute border-x-2 border-blue-600 top-0 right-[73px] bg-white dark:bg-slate-900 h-full w-2"></div>
              <div className="absolute border-x-2 border-blue-600 top-0 right-[107px] bg-white dark:bg-slate-900 h-full w-2"></div>
            </div>
            <ErrorMessage name="activation_code" component={FormError} />

            <Button
              variant="contained"
              type="submit"
              className="my-3 mx-auto bg-slate-500 w-full"
              disabled={
                !(formik.isValid && formik.dirty) || formik.isSubmitting
              }
            >
              S&apos;inscrire
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default VerificationForm;
