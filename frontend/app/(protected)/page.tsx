import Image from "next/image";
import { FC } from "react";

interface Props {}
const Page: FC<Props> = (props) => {
  return (
    <div className="grid w-full md:grid-cols-2 mt-11">
      <Image
        className="border rounded-full w-96 p-5 mx-auto my-4"
        src="/assets/hero.png"
        alt="ULEARNOW"
        width={200}
        height={200}
        priority
      />
      <div className="flex items-center justify-center flex-col text-justify md:h-[400px] md:p-3">
        <h1 className="text-2xl font-bold text-justify ">
          Application de gestion des personnels et des dossiers au service de
          l&apos;Unite de Traitement et d&apos;Analyse Judiciaires
        </h1>
        <h3 className="text-xs text-gray-600  dark:text-gray-300 mt-4">
          Introduction au service de l&apos;Unite de Traitement et
          d&apos;Analyse
        </h3>
        <div className="w-full flex items-center justify-center gap-2 mt-8">
          <input
            autoComplete="off"
            type="text"
            placeholder="Rechercher un dossier ou un personnel"
            className="p-2 w-full h-full rounded-md focus:bg-blue-100 focus:border focus:border-blue-600"
          />
          <button className="bg-blue-600 text-white p-2 rounded-md">
            Search
          </button>
        </div>
      </div>
      <form action="127.0.0.1:4000" method="post"></form>
    </div>
  );
};

export default Page;
