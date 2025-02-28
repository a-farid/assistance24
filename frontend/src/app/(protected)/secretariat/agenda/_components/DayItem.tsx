"use client";
import { IEvent } from "@/utils/interface/I_agenda";
import { Badge, IconButton } from "@mui/material";
import { Info } from "lucide-react";
import Link from "next/link";

type Props = {
  data: any;
  activeDay: any;
  handleShowEvents: (day: any) => void;
};

const DayItem = ({ data, activeDay, handleShowEvents }: Props) => {
  const { events, day, month, status } = data;

  const isActive = activeDay.day === day && activeDay.month === month;
  return (
    <li className="flex items-center justify-center flex-col relative">
      <IconButton
        color="inherit"
        className={`w-14 ${status} dark:hover:bg-slate-600`}
        onClick={() => handleShowEvents({ day, month })}
      >
        <Badge badgeContent={events?.length || 0} color="info">
          <span>{day}</span>
        </Badge>
      </IconButton>
      {isActive && (
        <div className="text-xs mt-1 top-8 left-5 rounded-md p-1 w-[200px]  bg-slate-100 dark:bg-slate-900 z-50 text-black absolute">
          {events && events.length > 0 ? (
            events.map((event: IEvent) => (
              <Link
                href={`/secretariat/agenda/evenements/${event.id}`}
                key={event.id}
                className="w-full my-2 px-2 py-1 text-[12px] text-black dark:text-white flex items-center justify-between border"
              >
                <span>{event.evenement}</span>
                <Info className="ml-2" />
              </Link>
            ))
          ) : (
            <p className="font-bold w-full my-2 px-2 text-[12px] text-black dark:text-white">
              Aucun événement
            </p>
          )}
        </div>
      )}
    </li>
  );
};

export default DayItem;
