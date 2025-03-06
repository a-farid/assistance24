"use client";
import { z } from "zod";
import toast from "react-hot-toast";
import CustomFormik from "@/components/custom/CustomFormik";
import { ResetPasswordFields } from "./ForgotPassword";
import axios from "axios";
import { useRouter } from "next/navigation";



const formSchema = z.object({email: z.string().email()})

type FormValues = z.infer<typeof formSchema>;
const initialValues = {
  email: "",
};

type Props = {};
function ForgotPasswordForm({}: Props) {
  const onSubmit = async ({email}: FormValues) => {
    const router = useRouter();
    try {
      const response:any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot_password`, {email});

      if (response.data.success){
        toast.success("Password reset link sent to your email");
        router.push("/")}
      else
        toast.error(response.data.message || "An error occurred");
    } catch (error) {
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
export default ForgotPasswordForm;
