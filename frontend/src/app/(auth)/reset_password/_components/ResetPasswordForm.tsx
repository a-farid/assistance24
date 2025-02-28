"use client";
import { z } from "zod";
import toast from "react-hot-toast";
import CustomFormik from "@/components/custom/CustomFormik";
import { useSearchParams } from "next/navigation";

import { ResetPasswordFields } from "./ResetPassword";
import axios from "axios";
import { useEffect } from "react";

const formSchema = z
  .object({
    password: z.string().min(6, { message: "Minimum of 6 characters" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Must contain at least one special character" }),
    password2: z.string().min(6, { message: "Minimum of 6 characters" }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  })

type FormValues = z.infer<typeof formSchema>;
const initialValues = {
  password: "",
  passwor2: "",
};

type Props = {};
function ResetPasswordForm({}: Props) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");


  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired token");
    }
  }, [token]);

  const onSubmit = async ({password}: FormValues) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset_password`, { token, password });
      if(response.data.success){
        toast.success("Password reset successfully!");
        window.location.href = "/"}
        else {toast.error(response.data.message || "An error occurred");}
      }
    catch (error) {
      if (error) {
        if (typeof error === "object" && "data" in error) {
          const errorData = error as any;
          console.log(errorData.data.message || "An error occurred");
        }
      }
    }}


  return (
    <div className="max-w-[600px] mx-auto">
      <CustomFormik
        initialValues={initialValues}
        formSchema={formSchema}
        onSubmit={onSubmit}
        fields={ResetPasswordFields}
        isLoading={false}
      />
    </div>
  );
}
export default ResetPasswordForm;
