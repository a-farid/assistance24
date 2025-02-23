"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import BtnsEvent from "../_components/BtnsEvent";
import { useGetEventsQuery } from "@/lib/features/secretariat/secApi";
import Loading from "@/components/custom/Loading";
import { IEvent } from "@/utils/interface/I_agenda";
import { useAppSelector } from "@/lib/hooks";

const AllEvents = () => {
  const { data, isLoading } = useGetEventsQuery("events");
  const { events } = useAppSelector((state: any) => state.sec);
  useEffect(() => {}, [events]);

  return (
    <div>
      <Link href={"/secretariat/agenda/evenements/ajouter"} className="w-full">
        <Button variant="outlined" className="w-full">
          Ajouter un evenement
        </Button>
      </Link>
      <h2>Toute les evenements</h2>
      {isLoading ? (
        <Loading />
      ) : (
        (data &&
          events.map((item: IEvent, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between w-full border-b-4 min-w-[490px]"
            >
              <div className="grid grid-cols-4 w-[90%] mx-4">
                <b className="my-auto">
                  <span className="hidden 900px:inline-block mr-1">- Le </span>
                  {item.dateDebut}
                </b>
                <h4 className="text-center col-span-2">{item.evenement}</h4>
                <b className="my-auto text-red-950 dark:text-red-200">
                  {item.typeEvent}
                </b>
              </div>
              <BtnsEvent eventId={item.id} />
            </div>
          ))) ||
        "Pas d'evenements pour le moment"
      )}
    </div>
  );
};
export default AllEvents;
