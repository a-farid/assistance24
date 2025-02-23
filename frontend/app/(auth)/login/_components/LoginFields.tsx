"use client";
import { FormikField } from "@/utils/interface/FormikField";
import { Field, FormikProps } from "formik";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Passwordfield = (formik: FormikProps<any>, fieldName: string) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Field
        autoComplete="off"
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
    </>
  );
};

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
