import React from "react";

type Props = {};
const weekDays = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const weekDaysShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const WeekDays = (props: Props) => {
  return (
    <>
      {/* <ul className=" grid-cols-7 hidden 900px:grid">
        {weekDays.map((day) => (
          <li
            key={day}
            className="text-center font-bold bg-gray-300 dark:bg-gray-700 border rounded-sm mx-1 my-2"
          >
            {day}
          </li>
        ))}
      </ul> */}
      <ul className="grid grid-cols-7">
        {weekDaysShort.map((day) => (
          <li
            key={day}
            className="text-center font-bold bg-gray-300 dark:bg-gray-700 border rounded-sm mx-1 my-2"
          >
            {day}
          </li>
        ))}
      </ul>
    </>
  );
};

export default WeekDays;
