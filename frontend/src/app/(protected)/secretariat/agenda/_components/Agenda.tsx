"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import WeekDays from "./WeekDays";
import DayItem from "./DayItem";
import { compareObj } from "@/utils/compareObjects";
import { IEvent } from "../../../../../utils/interface/I_agenda";
import { useAppSelector } from "@/lib/hooks";
import { useGetEventsQuery } from "@/lib/features/secretariat/secApi";

type Props = {};

const monthsInFrench = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const Agenda = (props: Props) => {
  const { data } = useGetEventsQuery("events");

  const ev = useAppSelector((state: any) => state.sec.events);

  const [date, setDate] = useState(new Date());
  const [activeDay, setActiveDay] = useState({
    day: null,
    month: null,
  });

  const handleShowEvents = (day: any) => {
    setActiveDay(
      compareObj(day, activeDay)
        ? {
            day: null,
            month: null,
          }
        : day
    );
  };
  const [days, setDays] = useState<
    { day: number; status: string; events?: any[] }[]
  >([]);

  useEffect(() => {
    const generateDays = () => {
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();

      const monthlastdate = new Date(currentYear, currentMonth, 0).getDate();
      const dayone = new Date(currentYear, currentMonth, 1).getDay();
      const lastdate = new Date(currentYear, currentMonth + 1, 0).getDate();
      const dayend = new Date(currentYear, currentMonth, lastdate).getDay();

      const days: {
        day: number;
        month: number;
        status: string;
        events?: any[];
      }[] = [];

      const lastM =
        Number(new Date(date.getFullYear(), date.getMonth() - 1).getMonth()) +
        1;
      const currentM =
        Number(new Date(date.getFullYear(), date.getMonth()).getMonth()) + 1;
      const nextM =
        Number(new Date(date.getFullYear(), date.getMonth() + 1).getMonth()) +
        1;
      for (let i = dayone; i > 0; i--) {
        days.push({
          day: monthlastdate - i + 1,
          status: "text-gray-500",
          month: lastM,
        });
      }

      for (let i = 1; i <= lastdate; i++) {
        const isToday =
          i === new Date().getDate() &&
          currentMonth === new Date().getMonth() &&
          currentYear === new Date().getFullYear()
            ? "font-bold bg-blue-600 text-white"
            : "font-bold";

        const events = ev.filter((event: IEvent) => {
          const eventDate = new Date(event.dateDebut);
          return (
            eventDate.getDate() === i &&
            eventDate.getMonth() === currentMonth &&
            eventDate.getFullYear() === currentYear
          );
        });

        days.push({ day: i, month: currentM, status: isToday, events });
      }

      for (let i = dayend; i < 6; i++) {
        days.push({
          day: i - dayend + 1,
          month: nextM,
          status: "text-gray-500",
        });
      }

      setDays(days);
    };

    generateDays();
  }, [ev, date, data]);
  const handlePreviousMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  return (
    <div className="min-w-[400px] ">
      <section className="border mx-auto rounded-md p-2 border-red-900 dark:border-red-200 max-w-md ">
        <header className="flex items-center justify-between px-8 gap-3 ml-10">
          <h4>{`${monthsInFrench[date.getMonth()]} ${date.getFullYear()}`}</h4>
          <div className="flex items-center justify-center ">
            <ChevronLeft
              className="hover:opacity-[100%] opacity-85 hover:scale-110 cursor-pointer"
              onClick={handlePreviousMonth}
            />
            <ChevronRight
              className="hover:opacity-[100%] opacity-85 hover:scale-110 cursor-pointer"
              onClick={handleNextMonth}
            />
          </div>
        </header>
        <WeekDays />
        <ul className="grid grid-cols-7">
          {days.map((dayData, index) => (
            <DayItem
              key={index}
              data={dayData}
              activeDay={activeDay}
              handleShowEvents={handleShowEvents}
            />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Agenda;
