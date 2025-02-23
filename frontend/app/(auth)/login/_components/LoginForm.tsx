"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import CustomFormik from "@/components/custom/CustomFormik";
import { LoginFields } from "./LoginFields";

const formSchema = z.object({
  username: z.string().min(3, { message: "Minimum of 6 characters" }),
  password: z.string().min(6, { message: "Minimum of 6 characters" }),
});
type FormValues = z.infer<typeof formSchema>;
const initialValues = { username: "", password: "" };

type Props = {};
function LoginForm({}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { data, error, isSuccess, isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "User logged in successfully";
      toast.success(message);
      router.push("/");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data, router, dispatch]);

  const onSubmit = async ({ username, password }: FormValues) => {
    try {
      await login({ username, password }).unwrap();
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
        fields={LoginFields}
        isLoading={isLoading}
      />
    </div>
  );
}
export default LoginForm;
