"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import CustomFormik from "@/components/custom/CustomFormik";
import { SignupFields } from "./SignupFields";

const formSchema = z
  .object({
    username: z.string().min(3, { message: "Minimum of 3 characters" }),
    departement: z.string(),
    matricule: z.string().min(5, { message: "Minimum of 5 characters" }),
    password1: z.string().min(6, { message: "Minimum of 6 characters" }),
    password2: z.string().min(6, { message: "Minimum of 6 characters" }),
    security_question: z.string(),
    security_answer: z.string(),
    is_active: z.boolean(),
    is_superuser: z.boolean(),
    is_staff: z.boolean(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"], // This path is where the error will be thrown
  });

type FormValues = z.infer<typeof formSchema>;
const initialValues = {
  username: "",
  departement: "",
  password1: "",
  password2: "",
  matricule: "",
  security_question: "",
  security_answer: "",
  is_active: true,
  is_superuser: false,
  is_staff: false,
};

type Props = {};
function SignupForm({}: Props) {
  // const router = useRouter();
  // const [register, { data, error, isSuccess, isLoading }] =
  //   useRegisterMutation();

  // useEffect(() => {
  //   if (isSuccess) {
  //     const message = data.message || "User signed up successfully";
  //     toast.success(message);
  //     router.push("/");
  //   }
  //   if (error) {
  //     if ("data" in error) {
  //       const errorData = error as any;
  //       toast.error(errorData.data.message);
  //     }
  //   }
  // }, [isSuccess, error, data, router]);

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("values", values);
      // await register({ ...values }).unwrap();
    } catch (error) {
      console.error(error);
      if (error) {
        if (typeof error === "object" && "data" in error) {
          const errorData = error as any;
          toast.error(errorData.data.message || "An error occurred");
        }
      }
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <CustomFormik
        initialValues={initialValues}
        formSchema={formSchema}
        onSubmit={onSubmit}
        fields={SignupFields}
        isLoading={false}
      />
    </div>
  );
}
export default SignupForm;
