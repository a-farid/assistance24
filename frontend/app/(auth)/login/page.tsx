type Props = {};
import Button from "@mui/material/Button";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";

function LoginPage({}: Props) {
  return (
    <div className="border p-2 max-w-md mx-auto mt-52">
      <div>
        <h1 className="w-full text-center font-bold text-[20px]">Login</h1>
        <p className="w-full text-center">
          Bonjour, login pour acceder a votre compte.
        </p>
      </div>
      <div>
        <div className="flex items-center flex-col w-full">
          <LoginForm />
          <hr />
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        <h1 className="text-center">Mot de passe oublie ?</h1>
        <Link href={"/reset"}>
          <Button className="w-full text-center ml-2" variant="text">
            Cliquer ici
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
