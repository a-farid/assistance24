"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import CustomFormik from "@/components/custom/CustomFormik";
import Loading from "@/components/custom/Loading";
import {useTranslations} from 'next-intl';
import { FormField } from "@/utils/interface/FormikField";
import LinesSkeleton from "@/components/skeleton/LinesSkeleton";
import { useEditConnectedUserMutation } from "@/lib/features/users/usersApi";


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

function EditProfileForm({}: {}) {
  const user = useAppSelector((state:any) => state.auth.user);

  type FormValues = z.infer<typeof formSchema>;
  const initialValues = { adress: user?.adress,
    first_name: user?.first_name,
    last_name: user?.last_name,
    phone: user?.phone
  } as FormValues;

  const t = useTranslations('ProfilePage');
  const EditProfileFields = new FormField(t('saveChanges') || 'Save Profile', [
    { label: t('first_name'), name: "first_name", type: "text" },
    { label: t('last_name'), name: "last_name", type: "text" },
    { label: t('adress'), name: "adress", type: "text" },
    { label: t('phone'), name: "phone", type: "text" },
  ]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [editConnectedUser, { data, error, isSuccess, isLoading }] = useEditConnectedUserMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "User logged in successfully";
      console.log("EditProfileForm: User data updated successfully", data);
      toast.success(message);
      router.push("/profile");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data, router, dispatch, user]);

  const onSubmit = async (values: FormValues) => {
    // Filter out empty optional fields
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key as keyof FormValues] = value;
      }
      return acc;
    }, {} as Partial<FormValues>);
    
    // You might want to use a different mutation for updating profile
    // await updateProfile(filteredValues).unwrap();
    await editConnectedUser(filteredValues).unwrap();
  };
  if(!user) return <LinesSkeleton />;

  return (
    <div className="max-w-[600px] mx-auto">
    {isLoading? <Loading /> :
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
