import React from "react";
import EvenementForm from "./_components/EventForm";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <h2 className="border-b pb-2">Ajouter un evenement</h2>
      <EvenementForm />
    </>
  );
};

export default page;
