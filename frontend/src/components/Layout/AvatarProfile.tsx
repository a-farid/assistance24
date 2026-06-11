import { Avatar } from "@mui/material";
import { HiOutlineUserCircle } from "react-icons/hi";
import Profile from "../Auth/Profile";

type Props = {
  user: any;
  setOpenProileBar: (value: boolean) => void;
  openProileBar: boolean;
};

const AvatarProfile = ({ user, openProileBar, setOpenProileBar }: Props) => {
   const avatarPhoto = user && user.url_photo && user.url_photo !== 'string' ? `${process.env.NEXT_PUBLIC_API_URL}/${user.url_photo}` : `${process.env.NEXT_PUBLIC_API_URL}/images/default.png`;

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
            src={avatarPhoto}
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
