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
        id={fieldName}
        name={fieldName}
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

export const SignupFields: FormikField = {
  submitBtn: "Enregistrer",
  data: [
    {
      label: "Username",
      name: "username",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Matricule",
      name: "matricule",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Password",
      name: "password1",
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
      label: "Departement",
      name: "departement",
      type: "select",
      autocomplete: "off",
      options: [
        { label: "Informatique", value: "Informatique" },
        { label: "Electrique", value: "Electrique" },
        { label: "Mecanique", value: "Mecanique" },
        { label: "Civil", value: "Civil" },
        { label: "Telecom", value: "Telecom" },
        { label: "Industriel", value: "Industriel" },
      ],
    },

    {
      label: "Question de securite",
      name: "security_question",
      type: "select",
      autocomplete: "off",
      options: [
        {
          label: "Quel est le nom de votre premier animal de compagnie?",
          value: "Quel est le nom de votre premier animal de compagnie?",
        },
        {
          label: "Quel est le nom de votre premier professeur?",
          value: "Quel est le nom de votre premier professeur?",
        },
        {
          label: "Quel est le nom de votre premier ami?",
          value: "Quel est le nom de votre premier ami?",
        },
      ],
    },
    {
      label: "Reponse",
      name: "security_answer",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "is_active",
      name: "is_active",
      type: "checkbox",
      autocomplete: "off",
    },
    {
      label: "is_superuser",
      name: "is_superuser",
      type: "checkbox",
      autocomplete: "off",
    },
    {
      label: "is_staff",
      name: "is_staff",
      type: "checkbox",
      autocomplete: "off",
    },
  ],
};
