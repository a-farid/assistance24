import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <CircularProgress
        className="mx-auto loading-spinner h-full"
        thickness={5}
      />
    </div>
  );
};

export default Loading;
