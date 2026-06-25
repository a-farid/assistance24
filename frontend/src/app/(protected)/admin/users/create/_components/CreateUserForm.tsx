"use client";
import CustomFormik from "@/components/custom/CustomFormik";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/custom/Loading";
import { useLocale, useTranslations } from "next-intl";
import { FormField } from "@/utils/interface/FormikField";
import { CreateUserFields_en, CreateUserFields_de } from "./CreateUserFields";
import { useCreateUser } from "@/lib/api/usersApi";
import { I_ApiResponseOne } from "@/utils/interface/standard_interface";
import { IUser } from "@/utils/interface/user_interfaces";
import log from "@/utils/logger";

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

const initialValues: FormValues = {
  first_name: "",
  last_name: "",
  adress: "",
  phone: "",
  email: "",
  username: "",
  role: "client", // optional: default role to prevent empty
};

function CreateUserForm() {
  const t = useTranslations("CreateUserPage");
  const locale = useLocale();
  const router = useRouter();

  const CreateUserFields = locale === "de" ? CreateUserFields_de : CreateUserFields_en;
  const formField = new FormField(CreateUserFields.submitBtn, CreateUserFields.data);

  const { mutate: createUser, isPending } = useCreateUser();

  const onSubmit = async (values: FormValues) => {
    createUser(values, {
      onSuccess: (responseData: I_ApiResponseOne<IUser>) => {
        log.info("LoginForm", t("userCreatedSuccessfully"));
        toast.success(t("userCreatedSuccessfully"));
        router.push("/admin/users"); // Secure client routing transition
      },
      onError: (error: any) => {
        const serverMessage = t("createUserError") || "Authentication rejected. Verify credentials.";
        toast.error(serverMessage);
        log.error("LoginForm", serverMessage, error);
      }
    });


  };

  return (
    <div className="max-w-[600px] mx-auto">
      {isPending ? ( <Loading /> ) :
        (<CustomFormik
          initialValues={initialValues}
          formSchema={formSchema}
          onSubmit={onSubmit}
          fields={formField}
          isLoading={isPending}
        /> )}
    </div>
  );
}

export default CreateUserForm;
