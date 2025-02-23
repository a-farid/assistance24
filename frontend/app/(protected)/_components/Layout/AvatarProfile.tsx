import { Avatar } from "@mui/material";
import { HiOutlineUserCircle } from "react-icons/hi";
import avatar from "../../../../public/assets/avatar.png";
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
            src={user.avatar?.url ? user.avatar.url : avatar}
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
