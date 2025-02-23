import { Button } from "@mui/material";
import LoginForm from "./LoginForm";

type Props = {
  setRoute: (route: string) => void;
  setOpenCustomModal: (open: boolean) => void;
};

function Login({ setOpenCustomModal, setRoute }: Props) {
  return (
    <>
      <div>
        <div>
          <div className="border p-2">
            <div>
              <h1 className="w-full text-center font-bold text-[20px]">
                Login
              </h1>
              <p className="w-full text-center">
                Bonjour, login pour acceder a votre compte.
              </p>
            </div>
            <div>
              <div className="flex items-center flex-col w-full">
                <LoginForm
                  setRoute={setRoute}
                  setOpenCustomModal={setOpenCustomModal}
                />
                <hr />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <h1 className="w-full text-center">
                N&apos;est pas encore inscrit?
              </h1>
              <Button
                className="w-full text-center"
                onClick={() => setRoute("Signup")}
              >
                s&apos;inscrire
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
