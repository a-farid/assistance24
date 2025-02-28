import React from "react";
import ChangePwForm from "./_components/ChangePwForm";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <h2>Changer votre mot de passe</h2>
      <ChangePwForm />
    </div>
  );
};

export default page;
