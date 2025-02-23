import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Link href={"/admin/users/create"}>
        <Button>Ajouter un utilisateur</Button>
      </Link>
    </div>
  );
};

export default page;
