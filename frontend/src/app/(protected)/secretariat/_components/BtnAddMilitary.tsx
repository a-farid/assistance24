import { Button } from "@mui/material";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

function BtnAddMilitary({}: Props) {
  return (
    <Link href={"/secretariat/militaire/ajouter"}>
      <Button variant="outlined">
        <UserPlus />
        <span className="ml-2">Ajouter un militaire</span>
      </Button>
    </Link>
  );
}

export default BtnAddMilitary;
