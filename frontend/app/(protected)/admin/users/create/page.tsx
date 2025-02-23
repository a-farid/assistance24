import React from "react";
import SignupForm from "./_components/SignupForm";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <h2>Ajouter un utilisateur</h2>
      <SignupForm />
    </div>
  );
};

export default page;
