"use client";
import { useEffect, useState } from "react";
import { useGetEventsQuery } from "@/lib/features/secretariat/secApi";
import { IEvent } from "../../../../../../utils/interface/I_agenda";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/custom/Loading";
import { useAppSelector } from "@/lib/hooks";

type Props = {
  params: {
    id: string;
  };
};

const EventDetails = ({ params }: Props) => {
  const router = useRouter();
  const { data, isLoading } = useGetEventsQuery("events");

  const { events } = useAppSelector((state: any) => state.sec);
  const [eventData, setEventData] = useState<IEvent | null>(null);

  useEffect(() => {
    if (data) {
      const foundEvent = events.find((e: any) => e.id === Number(params.id));
      setEventData(foundEvent || null);
    }
  }, [events, params.id, data]);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return eventData ? (
    <>
      <Button onClick={() => router.back()}>
        <ArrowLeft className="mr-2" />
        Tous les evenements
      </Button>
      <h2>Details de l&apos;evenement</h2>
      <div className="flex items-start gap-3 flex-col w-full p-4 border rounded-md">
        <div className="flex gap-3 flex-col pl-8 w-ful font-bold text-lg">
          <div className="grid grid-cols-2 w-full">
            <b className="pr-1 col-span-1">Evenement :</b>
            <span className="text-center">{eventData.evenement}</span>
          </div>
          <div className="grid grid-cols-2 w-full">
            <b className="pr-1 col-span-1">Lieu:</b>
            <span className="text-center">{eventData.lieuEvent}</span>
          </div>
          <div className="grid grid-cols-2 w-full">
            <b className="pr-1 col-span-1">Date de debut:</b>
            <span className="text-center">{eventData.dateDebut}</span>
          </div>
          <div className="grid grid-cols-2 w-full">
            <b className="pr-1 col-span-1">Date de fin:</b>
            <span className="text-center">{eventData.dateFin}</span>
          </div>
          <div className="grid grid-cols-2 w-full">
            <b className="pr-1 col-span-1">Heure de debut:</b>
            <span className="text-center">{eventData.timeStart}</span>
          </div>
          <div className="grid grid-cols-2 w-full">
            <b className="pr-1 col-span-1">Intervalle de temps:</b>
            <span className="text-center">{eventData.intervalleTime}</span>
          </div>
          <div className="grid grid-cols-2 w-full">
            <b className="pr-1 col-span-1">Type d&apos;evenement:</b>
            <span className="text-center">{eventData.typeEvent}</span>
          </div>
        </div>
        <div>
          <h4>Officiers concernes</h4>
          <ul className="flex gap-3 flex-col pl-8 w-ful font-bold text-lg">
            {eventData.userConcerners.map((officer, index) => (
              <li key={index}>{officer.nom_officier}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  ) : (
    <h1>Evenement non disponible</h1>
  );
};

export default EventDetails;
