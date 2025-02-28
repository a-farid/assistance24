import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="w-full">
      <CircularProgress
        className="mx-auto loading-spinner h-full"
        thickness={5}
      />
    </div>
  );
};

export default Loading;
