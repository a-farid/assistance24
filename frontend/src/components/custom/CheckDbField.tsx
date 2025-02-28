"use client";
import { ErrorMessage, Field, FormikProps } from "formik";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import FormError from "./FormError";
import toast from "react-hot-toast";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import axios from "axios";


export const Check_db_field = (formik: FormikProps<any>, fieldName: string) => {
  const [emailExists, setEmailExists] = useState({ show: false, exists: null });
  const [usernameExist, setUsernameExist] = useState({show: false,exists: null});

  const checkEmailExists = async (email: string) => {
    try {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/check_email/${email}`);

      setEmailExists({ show: true, exists: data.data });
      if (data.data == true) {
        await formik.setFieldError(
          "email",
          "Email already exists in the database!"
        );
        toast.error("Email already exists");
      }
      return data.data;
    } catch (error) {
      console.log("Error fetching email", error);
      return false;
    }
  };

  const checkUsernameExists = async (username: string) => {
    try {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/check_username/${username}`);
      setUsernameExist({ show: true, exists: data.data });
      if (data.data == true) {
        await formik.setFieldError(
          "username",
          "Username already exists in the database!"
        );
        toast.error("Username already exists");
      }
      return data.data;
    } catch (error) {
      console.log("Error fetching Username", error);
      return false;
    }
  };

  return (
    <>
      <Field
        autoComplete="off"
        className="col-span-2 font-bold p-2 border w-full"
        type="text"
        id={fieldName}
        name={fieldName}
        onBlur={async (e: any) => {
          const { name, value } = e.target;
          if (name === "email") await checkEmailExists(value);
          if (name === "username") await checkUsernameExists(value);
        }}
      />
      <div className="mx-2 absolute right-0 top-[50%] transform -translate-y-1/2">
        {emailExists.show &&
          (emailExists.exists ? (
            <MdOutlineDoNotDisturbOn color="red" />
          ) : (
            <FaCheck color="green" />
          ))}
        {usernameExist.show &&
          (usernameExist.exists ? (
            <MdOutlineDoNotDisturbOn color="red" />
          ) : (
            <FaCheck color="green" />
          ))}
      </div>

      <>
        <div></div>
        <div className="col-span-2 grid">
          <ErrorMessage
            name={fieldName}
            component={FormError}
            className="absolute top-0 right-0 col-span-3"
          />
        </div>
      </>
    </>
  );
};
