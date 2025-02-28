"use client";
import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { z, ZodError } from "zod";
import FormError from "@/components/custom/FormError";
import { useLoginMutation } from "../../../../lib/features/auth/authApi";
import toast from "react-hot-toast";
import Loading from "@/components/custom/Loading";
import { useRouter } from "next/navigation";

type Props = {
  setRoute: (route: string) => void;
  setOpenCustomModal: (open: boolean) => void;
};
const loginSchema = z.object({
  // username: z
  //   .string()
  //   .min(6, { message: "Username must be at least 6 characters long" }),
  email: z
    .string()
    .email()
    .min(6, { message: "Username must be at least 6 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
type FormValues = z.infer<typeof loginSchema>;

const initialValues = { email: "", password: "" };
const validateForm = (values: FormValues) => {
  try {
    loginSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
};

function LoginForm({ setRoute, setOpenCustomModal }: Props) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [login, { data, error, isSuccess, isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "User created successfully";
      toast.success(message);
      setOpenCustomModal(false);
      router.push("/");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data?.message, router, setOpenCustomModal]);

  const onSubmit = async ({ email, password }: FormValues) => {
    try {
      const data = { email, password };
      await login(data).unwrap();
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
                Email
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
            <ErrorMessage name="password" component={FormError} />
            <div className="w-full flex items-center justify-center ">
              {isLoading ? (
                <div>
                  {/* <Loader className="mx-auto" /> */}
                  <Loading />
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
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default LoginForm;
