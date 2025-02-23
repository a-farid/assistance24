"use client";
import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { useState } from "react";
import { z, ZodError } from "zod";
import FormError from "@/components/custom/FormError";
import { useRegisterMutation } from "../../../../lib/features/auth/authApi";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

type Props = {
  setRoute: (route: string) => void;
};
const signupSchema = z.object({
  name: z
    .string()
    .min(6, { message: "Name must be at least 6 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(6, { message: "email must be at least 6 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
type FormValues = z.infer<typeof signupSchema>;

const initialValues = { name: "", email: "", password: "" };
const validateForm = (values: FormValues) => {
  try {
    signupSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
};

function SignupForm({ setRoute }: Props) {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess, isLoading }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "User created successfully";
      toast.success(message);
      setRoute("verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data?.message, setRoute]);

  const onSubmit = async ({ name, email, password }: FormValues) => {
    try {
      const data = { name, email, password };
      await register(data).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={onSubmit}
      validateOnMount
    >
      {(formik) => {
        return (
          <Form>
            <div className="w-full grid grid-cols-3 my-5">
              <label htmlFor="name" className="col-span-1 font-bold p-2">
                name
              </label>
              <Field
                className="col-span-2 font-bold p-2 border w-full"
                type="text"
                id="name"
                name="name"
              />
            </div>
            <ErrorMessage name="name" component={FormError} />

            <div className="w-full grid grid-cols-3 my-5">
              <label htmlFor="email" className="col-span-1 font-bold p-2">
                email
              </label>
              <Field
                className="col-span-2 font-bold p-2 border w-full"
                type="text"
                id="email"
                name="email"
              />
            </div>
            <ErrorMessage name="email" component={FormError} />

            <div className="w-full grid grid-cols-3 my-5 relative">
              <label htmlFor="password" className="col-span-1 font-bold p-2">
                Password
              </label>
              <Field
                className="col-span-2 font-bold p-2 border w-full"
                type={show ? "text" : "password"}
                id="password"
                name="password"
              />
              <button
                className="mx-2 absolute right-0 top-[50%] transform -translate-y-1/2"
                onClick={() => setShow(!show)}
              >
                {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <FieldArray name="password" component={FormError} />
            <ErrorMessage name="password" component={FormError} />
            {isLoading ? (
              <div>
                <Loader />
              </div>
            ) : (
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
            )}
          </Form>
        );
      }}
    </Formik>
  );
}

export default SignupForm;
