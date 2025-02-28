"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import CustomFormik from "@/components/custom/CustomFormik";
import Loading from "@/components/custom/Loading";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import { SignupFields } from "./SignupFields";

const formSchema = z
  .object({
    adress: z.string().min(3, { message: "Minimum of 3 characters" }),
    first_name: z.string().min(3, { message: "Minimum of 3 characters" }),
    last_name: z.string().min(3, { message: "Minimum of 3 characters" }),
    phone: z.string().min(10, { message: "Minimum of 10 characters" }),
    username: z.string().min(3, { message: "Minimum of 3 characters" }),
    email: z.string().email(),
    admin_key: z.string(),
    hashed_password: z.string().min(6, { message: "Minimum of 6 characters" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Must contain at least one special character" }),
    password2: z.string().min(6, { message: "Minimum of 6 characters" }),
  })
  .refine((data) => data.hashed_password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  })

type FormValues = z.infer<typeof formSchema>;
const initialValues = {
  username: "user",
  email: "user@mail.com",
  hashed_password: "Aqwzsx@123",
  password2: "Aqwzsx@123",
  first_name: "farid",
  last_name: "lord",
  adress: "Paris France",
  phone: "212708010523",
  admin_key: "assistance",
};
function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { data, error, isSuccess, isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "Welcome to the platform (Admin)";
      toast.success(message);
      router.push("/");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.info);
      }
    }
  }, [isSuccess, error, data, router, dispatch]);

  const onSubmit = async (values: FormValues) => {
      await register(values).unwrap();
    };

  return (
    <div className="max-w-[600px] mx-auto">
      {isLoading ? (
        <Loading />
      ) : (
        <CustomFormik
          initialValues={initialValues}
          formSchema={formSchema}
          onSubmit={onSubmit}
          fields={SignupFields}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default RegisterForm;


// function RegisterForm({}: {}) {
//   const router = useRouter();
//   const [register, { data, error, isSuccess, isLoading }] = useRegisterMutation();

//   useEffect(() => {
//     if (isSuccess) {
//       const message = data.message || "Welcome to the platform (Admin)";
//       toast.success(message);
//       router.push("/");
//     }
//     if (error) {
//       if ("data" in error) {
//         const errorData = error as any;
//         toast.error(errorData.data.info);
//       }
//     }
//   }, [isSuccess, error, data, router]);

//   const onSubmit = async (values: FormValues) => {
//       await register({...values}).unwrap();
//   };

//   return (
//     <div className="max-w-[600px] mx-auto">
//     {isLoading? <Loading /> :
//           <CustomFormik
//             initialValues={initialValues}
//             formSchema={formSchema}
//             onSubmit={onSubmit}
//             fields={SignupFields}
//             isLoading={isLoading}
//           />}
//     </div>
//   );
// }
// export default RegisterForm;



