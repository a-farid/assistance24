import Profile from "@/app/(auth)/_components/Profile";
import UserImage from "@/app/(auth)/_components/UserPhoto";

// test
type Props = {
  setOpenProfileBar: (value: boolean) => void;
  openProfileBar: boolean;
};

const AvatarProfile = ({ openProfileBar, setOpenProfileBar }: Props) => {

  return (
    <>
      <div
        id="profileBtn"
        className="relative mx-3 cursor-pointer"
        onClick={() => setOpenProfileBar(!openProfileBar)}
      >
        <UserImage widthHeight={40} />
        {openProfileBar && (<Profile setOpenProfileBar={setOpenProfileBar} />)}
      </div>
    </>
  );
};

export default AvatarProfile;
