import Loading from "../components/custom/Loading";
import React from "react";

type Props = {};

const loading = (props: Props) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Loading />
    </div>
  );
};
export default loading;
