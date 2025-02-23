import Link from "next/link";
import { Info, Pencil } from "lucide-react";
import { Button } from "@mui/material";
import DeletEventBtn from "./DeletEventBtn";

type Props = {
  eventId: number;
};

const BtnsEvent = ({ eventId }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-center 900px:hidden gap-1">
        <Link href={`evenements/${eventId}`}>
          <Info color="blue" />
        </Link>
        <Link href={`evenements/${eventId}/edit`}>
          <Pencil color="green" />
        </Link>
        <DeletEventBtn eventId={eventId} />
      </div>
      <div className="hidden 900px:flex items-center justify-center gap-2">
        <Link href={`evenements/${eventId}`}>
          <Button variant="outlined" color="info">
            INFOS
          </Button>
        </Link>
        <Link href={`evenements/${eventId}/edit`}>
          <Button variant="outlined" color="warning">
            EDIT
          </Button>{" "}
        </Link>
        <DeletEventBtn eventId={eventId} />
      </div>
    </div>
  );
};

export default BtnsEvent;
