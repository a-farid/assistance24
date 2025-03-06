"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import CustomFormik from "@/components/custom/CustomFormik";
import Loading from "@/components/custom/Loading";
import {useTranslations} from 'next-intl';
import { FormField } from "@/utils/interface/FormikField";



const formSchema = z.object({
  username: z.string().min(3, { message: "Minimum of 6 characters" }),
  password: z.string().min(6, { message: "Minimum of 6 characters" }),
});
type FormValues = z.infer<typeof formSchema>;
const initialValues = { username: "", password: "" };

function LoginForm({}: {}) {
  const t = useTranslations('LoginPage');
  const LoginFields = new FormField(t('connectBtn'), [
    { label: "Username", name: "username", type: "text" },
    { label: "Password", name: "password", type: "password" },
  ]);
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
      await login({ username, password }).unwrap();
  };

  return (
    <div className="max-w-[600px] mx-auto">
    {isLoading? <Loading /> :
          <CustomFormik
            initialValues={initialValues}
            formSchema={formSchema}
            onSubmit={onSubmit}
            fields={LoginFields}
            isLoading={isLoading}
          />}
    </div>
  );
}
export default LoginForm;
