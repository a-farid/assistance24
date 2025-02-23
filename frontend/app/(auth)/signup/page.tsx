import Button from "@mui/material/Button";
import SignupForm from "./_components/SignupForm";
import Link from "next/link";

function SignupPage() {
  return (
    <div className="border p-5 max-w-[600px] mx-auto mt-32">
      <div>
        <h1 className="w-full text-center font-bold text-[20px]">
          S&apos;inscrire
        </h1>
        <p className="w-full text-center">
          S&apos;inscrire s&apos;il vous plait pour acceder a votre platform.
        </p>
      </div>
      <div>
        <div className="flex items-center flex-col w-full">
          <SignupForm />
          <hr />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
