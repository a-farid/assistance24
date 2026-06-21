"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomFormik from "@/components/custom/CustomFormik"; // 
import Loading from "@/components/custom/Loading";
import { useTranslations } from 'next-intl';
import { FormField } from "@/utils/interface/FormikField";
import LinesSkeleton from "@/components/shared/LinesSkeleton";
// import { useEditConnectedUserMutation } from "@/lib/features/users/usersApi"; // Will be deleted
import { useAuthStore } from "@/lib/store/authStore";
import log from "@/utils/logger";
import { useEditConnectedUser } from "@/lib/api/usersApi";



const formSchema = z.object({
  adress: z.string().min(3, { message: "Minimum of 3 characters" }).optional(),
  first_name: z.string().min(3, { message: "Minimum of 3 characters" }).optional(),
  last_name: z.string().min(6, { message: "Minimum of 3 characters" }).optional(),
  phone: z
    .string()
    .min(6, { message: "Minimum of 6 characters" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })
    .optional(),
});

function EditProfileForm({ }: {}) {
  const router = useRouter();
  const { user, isLoading, setUser } = useAuthStore();
  const t = useTranslations('ProfilePage');

  // 💡 1. Initialize the TanStack Mutation Executer
  const { mutate: editConnectedUser, isPending } = useEditConnectedUser();
  type FormValues = z.infer<typeof formSchema>;
  const initialValues = {
    adress: user?.adress,
    first_name: user?.first_name,
    last_name: user?.last_name,
    phone: user?.phone
  } as FormValues;

  const EditProfileFields = new FormField(t('saveChanges') || 'Save Profile', [
    { label: t('first_name'), name: "first_name", type: "text" },
    { label: t('last_name'), name: "last_name", type: "text" },
    { label: t('adress'), name: "adress", type: "text" },
    { label: t('phone'), name: "phone", type: "text" },
  ]);

      // 💡 2. Streamlined Synchronous Form Submission Handler


  // useEffect(() => {
  //   if (isSuccess) {
  //     const message = data?.message || "User logged in successfully";
  //     toast.success(message);
  //     if (data?.data) {
  //     setUser(data.data); 
  //     }
  //     router.push("/profile");

  //   }
  //   if (error) {
  //     if ("data" in error) {
  //       const errorData = error as any;
  //       toast.error(errorData.data.message);
  //     }
  //   }
  // }, [isSuccess, error, data, router, user]);

  // const onSubmit = async (values: FormValues) => {
  //   // Filter out empty optional fields
  //   const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
  //     if (value && value.trim() !== '') {
  //       acc[key as keyof FormValues] = value;
  //     }
  //     return acc;
  //   }, {} as Partial<FormValues>);

  //   // You might want to use a different mutation for updating profile
  //   // await updateProfile(filteredValues).unwrap();
  //   await editConnectedUser(filteredValues).unwrap();
  // };

  const onSubmit = (values: FormValues) => {
    // Sanitize payload data constraints
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        acc[key as keyof FormValues] = value;
      }
      return acc;
    }, {} as Partial<FormValues>);

    // 💡 3. Execute the Mutation directly with inline closure lifecycles
    editConnectedUser(filteredValues, {
      onSuccess: (responseData) => {
        const message = responseData?.message || "Profile configuration updated successfully.";
        toast.success(message);
        router.push("/profile"); // Safe programmatic routing post-mutation commit
      },
      onError: (error: any) => {
        // Safe runtime extraction of Axios backend error models
        const serverMessage = error?.response?.data?.message || "An error occurred updating profile.";
        toast.error(serverMessage);
        log.error("EditProfileForm", "Mutation failure exception context", error);
      }
    });
  };

  if (!user) return <LinesSkeleton />;

  return (
    <div className="max-w-[600px] mx-auto">
      {isLoading ? <Loading /> :
        <CustomFormik
          initialValues={initialValues}
          formSchema={formSchema}
          onSubmit={onSubmit}
          fields={EditProfileFields}
          isLoading={isLoading}
        />}
    </div>
  );
}
export default EditProfileForm;
