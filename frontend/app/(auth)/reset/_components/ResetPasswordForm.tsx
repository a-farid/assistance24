"use client";
import { z } from "zod";
import toast from "react-hot-toast";
import CustomFormik from "@/components/custom/CustomFormik";
import { ResetPasswordFields } from "./ResetPasswordFields";

const formSchema = z
  .object({
    username: z.string().min(3, { message: "Minimum of 3 characters" }),
    matricule: z.string().min(5, { message: "Minimum of 5 characters" }),
    new_password: z.string().min(6, { message: "Minimum of 6 characters" }),
    confirm_password: z.string().min(6, { message: "Minimum of 6 characters" }),
    security_question: z.string(),
    security_answer: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof formSchema>;
const initialValues = {
  username: "",
  matricule: "",
  new_password: "",
  confirm_password: "",
  security_question: "",
  security_answer: "",
};

type Props = {};
function ResetPasswordForm({}: Props) {
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
        fields={ResetPasswordFields}
        isLoading={false}
      />
    </div>
  );
}
export default ResetPasswordForm;
