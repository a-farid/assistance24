"use client";

import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomFormik from "@/components/custom/CustomFormik";
import Loading from "@/components/custom/Loading";
import { useTranslations } from 'next-intl';
import { FormField } from "@/utils/interface/FormikField";
import { useLoginMutation } from "@/lib/api/auth"; // 💡 Adjusted naming to match your export target
import log from "@/utils/logger";
import { I_ApiResponseOne } from "@/utils/interface/global";
import { IUser } from "@/utils/interface/user_interfaces";

const formSchema = z.object({
  username: z.string().min(3, { message: "Minimum of 3 characters required" }),
  password: z.string().min(6, { message: "Minimum of 6 characters required" }),
});

type FormValues = z.infer<typeof formSchema>;
const initialValues: FormValues = { username: "", password: "" };

function LoginForm() {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  
  // 💡 1. Initialize our decoupled TanStack session mutation channel
  const { mutate: login, isPending } = useLoginMutation();

  const LoginFields = new FormField(t('connectBtn') || 'Login', [
    { label: "Username", name: "username", type: "text" },
    { label: "Password", name: "password", type: "password" },
  ]);
  
  // 💡 2. Fixed Synchronous Event Handler Routing
  const onSubmit = (values: FormValues) => {
    
    login(values, {
      onSuccess: (responseData: I_ApiResponseOne<IUser>) => {
        log.info("LoginForm", responseData.message || "Login successful.");
        const message = "Session initialized successfully.";
        toast.success(message);
        router.push("/"); // Secure client routing transition
      },
      onError: (error: any) => {
        const serverMessage = error?.response?.data?.message || "Authentication rejected. Verify credentials.";
        toast.error(serverMessage);
        log.error("LoginForm", "Authentication process failure context:", error);
      }
    });
  };

  // 💡 3. Component level return statement (Correctly scoped out of onSubmit)
  return (
    <div className="max-w-[600px] mx-auto p-4">
      {isPending ? (
        <Loading />
      ) : (
        <CustomFormik
          initialValues={initialValues}
          formSchema={formSchema}
          onSubmit={onSubmit}
          fields={LoginFields}
          isLoading={isPending}
        />
      )}
    </div>
  );
}

export default LoginForm;