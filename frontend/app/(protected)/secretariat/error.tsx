"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

type Props = { error: Error; reset: () => void };
const ErrorComponent = ({ error, reset }: Props) => {
  const router = useRouter();
  // we can use the error object to get the error message
  // we use reset to reset the error state, the parent component must be client side
  return (
    <>
      <div>An error was occured</div>
      <div className="text-yellow-700">{error.message}</div>
      <Button variant="contained" onClick={() => router.back()}>
        Back
      </Button>
      <Button variant="contained" onClick={() => reset()}>
        Try again ???
      </Button>
    </>
  );
};

export default ErrorComponent;
