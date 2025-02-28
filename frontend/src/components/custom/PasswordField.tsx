"use client";
import { ErrorMessage, Field, FormikProps } from "formik";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import FormError from "./FormError";



export const Passwordfield = (formik: FormikProps<any>, fieldName: string) => {
  const [showPassword, setShowPassword] = useState(false);
  console.log('formik errors', formik.errors);
  return (
    <>
      <>
        <Field
          autoComplete="off"
          className="col-span-2 font-bold p-2 border w-full"
          type={showPassword ? "text" : "password"}
          id={fieldName}
          name={fieldName}
          />
          <div className="mx-2 absolute right-0 top-[50%] transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
      </>
      <>
        <div></div>
        <div className="col-span-2 grid">
          <ErrorMessage name={fieldName} component={FormError} className="absolute top-0 right-0 col-span-3"/>
        </div>
      </>
    </>
  );
};
