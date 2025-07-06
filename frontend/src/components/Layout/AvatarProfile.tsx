import { Avatar } from "@mui/material";
import { HiOutlineUserCircle } from "react-icons/hi";
import Profile from "../Auth/Profile";

type Props = {
  user: any;
  setOpenProileBar: (value: boolean) => void;
  openProileBar: boolean;
};

const AvatarProfile = ({ user, openProileBar, setOpenProileBar }: Props) => {
  return (
    <>
      <div
        id="profileBtn"
        className="relative mx-3 cursor-pointer"
        onClick={() => setOpenProileBar(!openProileBar)}
      >
        {user ? (
          <Avatar
            alt={`${user.username} photo profile`}
            // src={user.url_photo ? user.url_photo : "http://localhost:8000/api/images/1.png"}
            src={"http://localhost:8000/api/images/3.png"}
          />
        ) : (
          <HiOutlineUserCircle />
        )}
        {openProileBar && (
          <Profile user={user} setOpenProileBar={setOpenProileBar} />
        )}
      </div>
    </>
  );
};

export default AvatarProfile;
