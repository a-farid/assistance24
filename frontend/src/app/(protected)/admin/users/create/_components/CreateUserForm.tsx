"use client";
import CustomFormik from "@/components/custom/CustomFormik";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import Loading from "@/components/custom/Loading";
import {useLocale, useTranslations} from 'next-intl';
import { FormField } from "@/utils/interface/FormikField";
import { CreateUserFields_en, CreateUserFields_de } from "./CreateUserFields";

const formSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  adress: z.string().min(5, { message: "Address must be at least 5 characters" }),
  phone: z.string().min(8, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  role: z.enum(["client", "worker"], { required_error: "Role is required" }),
});

type FormValues = z.infer<typeof formSchema>;
const initialValues = {
  first_name: "",
  last_name: "",
  adress: "",
  phone: "",
  email: "",
  username: "",
  role: "",
};

function CreateUserForm({}: {}) {
  const t = useTranslations('CreateUserPage');

  const locale = useLocale();
  const CreateUserFields = locale === "de" ? CreateUserFields_de : CreateUserFields_en;

  const formField = new FormField(CreateUserFields.submitBtn, CreateUserFields.data);
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

  const onSubmit = async (data: FormValues) => {
      await login(data).unwrap();
  };

  return (
    <div className="max-w-[600px] mx-auto">
    {isLoading? <Loading /> :
          <CustomFormik
            initialValues={initialValues}
            formSchema={formSchema}
            onSubmit={onSubmit}
            fields={formField}
            isLoading={isLoading}
          />}
    </div>
  );
}
export default CreateUserForm;
