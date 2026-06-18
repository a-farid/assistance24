import { Avatar } from "@mui/material";
import { HiOutlineUserCircle } from "react-icons/hi";
import Profile from "../Auth/Profile";
// test
type Props = {
  user: any;
  setOpenProfileBar: (value: boolean) => void;
  openProfileBar: boolean;
};

const AvatarProfile = ({ user, openProfileBar, setOpenProfileBar }: Props) => {
   const avatarPhoto = user && user.url_photo && user.url_photo !== 'string' ? `${process.env.NEXT_PUBLIC_API_URL}/${user.url_photo}` : `${process.env.NEXT_PUBLIC_API_URL}/images/default.png`;

  return (
    <>
      <div
        id="profileBtn"
        className="relative mx-3 cursor-pointer"
        onClick={() => setOpenProfileBar(!openProfileBar)}
      >
        {user ? (
          <Avatar
            alt={`${user.username} photo profile`}
            src={avatarPhoto}
          />
        ) : (
          <HiOutlineUserCircle />
        )}
        {openProfileBar && (
          <Profile user={user} setOpenProfileBar={setOpenProfileBar} />
        )}
      </div>
    </>
  );
};

export default AvatarProfile;
