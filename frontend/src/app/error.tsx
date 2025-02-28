"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

type Props = { error: Error; reset: () => void };
const ErrorComponent = ({ error, reset }: Props) => {
  const router = useRouter();
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h2 className="font-bold text-[30px] w-full text-center">An error was occured</h2>
      <div className="text-yellow-700">{error.message}</div>
      <Button variant="contained" onClick={() => router.back()}>
        Back
      </Button>
      <Button variant="contained" onClick={() => reset()}>
        Try again ???
      </Button>
    </div>
  );
};

export default ErrorComponent;
