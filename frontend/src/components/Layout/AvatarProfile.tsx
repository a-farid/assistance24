import Profile from "@/app/(auth)/_components/Profile";
import UserImage from "@/app/(auth)/_components/UserPhoto";

// test
type Props = {
  user: any;
  setOpenProfileBar: (value: boolean) => void;
  openProfileBar: boolean;
};

const AvatarProfile = ({ user, openProfileBar, setOpenProfileBar }: Props) => {

  return (
    <>
      <div
        id="profileBtn"
        className="relative mx-3 cursor-pointer"
        onClick={() => setOpenProfileBar(!openProfileBar)}
      >
        <UserImage user={user} widthHeight={40} />
        {openProfileBar && (
          <Profile user={user} setOpenProfileBar={setOpenProfileBar} />
        )}
      </div>
    </>
  );
};

export default AvatarProfile;
