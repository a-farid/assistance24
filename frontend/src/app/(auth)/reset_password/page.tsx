import Button from "@mui/material/Button";
import ResetPasswordForm from "./_components/ResetPasswordForm";
import Link from "next/link";

function ForgotPasswordPage() {
  return (
    <div className="border p-5 max-w-[600px] mx-auto mt-32">
      <div>
        <h1 className="w-full text-center font-bold text-[20px]">
          Recuperer votre compte
        </h1>
        <p className="w-full text-center">
          Remplir les champs avec les bonnes informations.
        </p>
      </div>
      <div>
        <div className="flex items-center flex-col w-full">
          <ResetPasswordForm />
          <hr />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <h1 className="text-center mr-3">Deja inscrit?</h1>
        <Link href={"/login"}>
          <Button className="w-full text-center">Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
