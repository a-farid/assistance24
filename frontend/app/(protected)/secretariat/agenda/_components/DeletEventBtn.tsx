"use client";
import React, { useEffect } from "react";
import { Check, CircleX, X } from "lucide-react";
import { Button, Box } from "@mui/material";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useDeleteEventMutation } from "@/lib/features/secretariat/secApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
type Props = {
  eventId: number;
};

const DeletEventBtn = ({ eventId }: Props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [deleteEvent, { error, isSuccess }] = useDeleteEventMutation();
  useEffect(() => {
    if (isSuccess) {
      const message = "Event deleted successfully";
      toast.success(message);
      router.refresh();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [error, isSuccess, router]);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box className="relative">
        <CircleX
          color="red"
          className="900px:hidden cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        />

        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpen((prev) => !prev)}
          className="hidden 900px:flex"
        >
          DELETE
        </Button>
        {open ? (
          <Box className="absolute right-0 bottom-4 z-50 bg-slate-300 w-56 h-8 border rounded-md text-black p-3 flex items-center justify-between">
            <span>Vous etes sur ?</span>
            <Check color="green" onClick={() => deleteEvent(eventId)} />
            <X color="red" onClick={() => setOpen(false)} />
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
};

export default DeletEventBtn;
