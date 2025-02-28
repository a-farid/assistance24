import { Button } from "@mui/material";
interface Props {
  setRoute: (route: string) => void;
  setOpenCustomModal: (open: boolean) => void;
}
const NotLoggedRoutes = ({ setRoute, setOpenCustomModal }: Props) => {
  return (
    <div className="flex items-center">
      <Button
        onClick={() => {
          setRoute("Login");
          setOpenCustomModal(true);
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          setRoute("Signup");
          setOpenCustomModal(true);
        }}
      >
        Signup
      </Button>
    </div>
  );
};

export default NotLoggedRoutes;
