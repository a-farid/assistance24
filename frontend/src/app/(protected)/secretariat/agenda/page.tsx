"use client";
import { Button } from "@mui/material";
import Agenda from "./_components/Agenda";
import Link from "next/link";

type Props = {};
const Page = ({}: Props) => {
  return (
    <div className="p-5 grid grid-cols-1 1100px:grid-cols-2">
      <Agenda />
      <div className="flex items-center justify-center flex-col gap-4 my-4 max-w-80 mx-auto">
        <Link
          href={"/secretariat/agenda/evenements/ajouter"}
          className="w-full"
        >
          <Button variant="outlined" className="w-full">
            Ajouter un evenement
          </Button>
        </Link>
        <Link href={"/secretariat/agenda/evenements"} className="w-full">
          <Button variant="outlined" className="w-full">
            Toute les evenements
          </Button>
        </Link>
        <Link href={"/secretariat/agenda/evenements"} className="w-full">
          <Button variant="outlined" className="w-full">
            Exporter l&apos;agenda de la semaine
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
