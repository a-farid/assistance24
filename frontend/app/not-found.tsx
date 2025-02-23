"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h2 className="font-bold text-[30px] w-full text-center">Not Found</h2>
      <p>Could not find requested resource</p>
      <div className="flex items-center justify-center gap-3 mt-5">
        <Link href="/">
          <Button variant="contained">Home</Button>
        </Link>
        <Button variant="contained" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}
