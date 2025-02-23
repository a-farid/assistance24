import { Button } from "@mui/material";
import VerificationForm from "./VerificationForm";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

function Verification({ setOpen, setRoute }: Props) {
  return (
    <>
      <div>
        <div>
          <div className="border p-2">
            <div>
              <h1 className="w-full text-center font-bold text-[20px]">
                Verification
              </h1>
              <p className="w-full text-center">
                Bonjour, saisir votre OTP afin d-activer votre compte.
              </p>
            </div>
            <div>
              <div className="flex items-center flex-col w-full">
                <VerificationForm setRoute={setRoute} />
                <hr />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <h1 className="w-full text-center">Deja inscrit?</h1>
              <Button
                className="w-full text-center"
                onClick={() => setRoute("Login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verification;
