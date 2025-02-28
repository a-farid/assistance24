"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import CustomFormik from "@/components/custom/CustomFormik";
import {
  useEditEventMutation,
  useGetEventsQuery,
} from "@/lib/features/secretariat/secApi";
import { EventFormFields } from "../../../ajouter/_components/EventFormFields";
import { IEvent } from "../../../../../../../../utils/interface/I_agenda";
import { z } from "zod";
import Loading from "@/components/custom/Loading";
import { EventFormSchema } from "../../../ajouter/_components/EventForm";
import { Button } from "@mui/material";
import { useAppSelector } from "@/lib/hooks";

type FormValues = z.infer<typeof EventFormSchema>;
EventFormFields.submitBtn = "Modifier";
type Props = {
  id: number;
};

function EditEventForm({ id }: Props) {
  const { events } = useAppSelector((state: any) => state.secretariat);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading: eventsLoading } = useGetEventsQuery("events");
  const [eventData, setEventData] = useState<IEvent | null>(null);

  useEffect(() => {
    if (data) {
      const foundEvent = data.data.find((e: any) => e.id === Number(id));
      setEventData(foundEvent || null);
    }
  }, [data, id, eventData]);

  const [editEvent, { error, isSuccess, isLoading }] = useEditEventMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Event updated successfully");
      router.back();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, router, dispatch]);

  const onSubmit = async (values: FormValues) => {
    try {
      await editEvent({ ...values }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  if (eventsLoading || !eventData) {
    return (
      <div>
        {eventsLoading ? (
          <Loading />
        ) : (
          <div>
            Evenement non trouve{" "}
            <Button onClick={() => router.back()}>Retour</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto">
      <CustomFormik
        initialValues={eventData}
        formSchema={EventFormSchema}
        onSubmit={onSubmit}
        fields={EventFormFields}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditEventForm;
