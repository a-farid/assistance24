"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import CustomFormik from "@/components/custom/CustomFormik";
import { EventFormFields } from "./EventFormFields";
import { useAddEventMutation } from "@/lib/features/secretariat/secApi";

export const EventFormSchema = z.object({
  sceOrigine: z.string().min(3, { message: "Minimum of 3 characters" }),
  refEcrit: z.number(),
  evenement: z.string().min(3, { message: "Minimum of 3 characters" }),
  lieuEvent: z.string().min(3, { message: "Minimum of 3 characters" }),
  dateDebut: z.string().date(),
  dateFin: z.string().date(),
  timeStart: z.string().time(),
  intervalleTime: z.string(),
  typeEvent: z.string().min(6, { message: "Minimum of 3 characters" }),
  officierConcerners: z.string().min(3, { message: "Minimum of 3 characters" }),
});
type FormValues = z.infer<typeof EventFormSchema>;
const initialValues = {
  sceOrigine: "",
  refEcrit: 0,
  evenement: "",
  lieuEvent: "",
  dateDebut: "",
  dateFin: "",
  timeStart: "",
  intervalleTime: "",
  typeEvent: "",
  officierConcerners: "",
};

type Props = {};
function EvenementForm({}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [addEvent, { data, error, isSuccess, isLoading }] =
    useAddEventMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "Event created successfully";
      toast.success(message);
      router.back();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data, router, dispatch]);

  const onSubmit = async (values: FormValues) => {
    try {
      await addEvent({ ...values }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <CustomFormik
        initialValues={initialValues}
        formSchema={EventFormSchema}
        onSubmit={onSubmit}
        fields={EventFormFields}
        isLoading={isLoading}
      />
    </div>
  );
}
export default EvenementForm;
