import Image from "next/image";
import { FC } from "react";

interface Props {}
const Page: FC<Props> = (props) => {
  return (
    <div className="grid w-full md:grid-cols-2 mt-11">
      <Image
        className="border rounded-lg w-96 p-2 mx-auto my-4"
        src="/assets/logo.png"
        alt="ULEARNOW"
        width="0"
        height="0"
        sizes="100vw"
        style={{ width: '300px', height: 'auto' }}
        priority
      />
      <div className="flex items-center justify-center flex-col text-justify md:p-3">
        <h1 className="text-justify font-bold text-[20px]">
          Cette application est un outil de gestion des contrats et du personnel
          de de la société Assistanz365. Elle
          permet de gerer les dossiers, les personnels et les contrats.
        </h1>
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
    </div>
  );
};

export default Page;
