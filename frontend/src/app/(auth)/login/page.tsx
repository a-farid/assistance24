type Props = {};
import Button from "@mui/material/Button";
import Link from "next/link";
import LoginForm from "./_LoginForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export const metadata: Metadata = {
  title: "Login",
  description: "Login to access your account",
};

async function LoginPage({}: Props) {
  const t = await getTranslations("LoginPage");
  return (
    <div className="border p-20 max-w-md mx-auto mt-52">
      <div>
        <h1 className="w-full text-center font-bold text-[20px] mb-5">{t("title")}</h1>
      </div>
      <div>
        <div className="flex items-center flex-col w-full">
          <LoginForm />
          <hr />
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        <h1 className="text-center">Mot de passe oublie ?</h1>
        <Link href={"/forgot_password"}>
          <Button className="w-full text-center ml-2" variant="text">
            Cliquer ici
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
