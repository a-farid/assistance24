"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import CustomFormik from "@/components/custom/CustomFormik";
import { ChangePwFields } from "./ChangePwFields"; // inspected below

const formSchema = z
  .object({
    current_password: z.string().min(3, { message: "Minimum of 6 characters" }),
    new_password: z.string().min(6, { message: "Minimum of 6 characters" }),
    new_password_confirm: z
      .string()
      .min(6, { message: "Minimum of 6 characters" }),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords do not match",
    path: ["new_password_confirm"],
  });

type FormValues = z.infer<typeof formSchema>;

const initialValues: FormValues = {
  current_password: "",
  new_password: "",
  new_password_confirm: "",
};

type Props = {};

function ChangePwForm({}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [hasMounted, setHasMounted] = useState(false);

  const [login, { data, error, isSuccess, isLoading }] = useLoginMutation();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (isSuccess) {
      const message = data?.message || "User logged in successfully";
      toast.success(message);
      router.push("/");
    }

    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData.data.message || "An error occurred");
    }
  }, [hasMounted, isSuccess, error, data, router]);

  const onSubmit = async (values: FormValues) => {
    try {
      await login({
        username: values.current_password,
        password: values.new_password,
      }).unwrap(); // Just as example – update this to fit your logic
    } catch (err) {
      console.error(err);
      if (typeof err === "object" && err && "data" in err) {
        const errorData = err as any;
        toast.error(errorData.data.message || "An error occurred");
      }
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <CustomFormik
        initialValues={initialValues}
        formSchema={formSchema}
        onSubmit={onSubmit}
        fields={ChangePwFields}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ChangePwForm;
