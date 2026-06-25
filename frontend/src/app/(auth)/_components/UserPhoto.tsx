import Image from 'next/image';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { useAuthAuthorization } from '@/lib/store/authStore';
import { IUser } from '@/utils/interface/user_interfaces';

type Props = {
  userImg?: IUser,
  widthHeight?: number;
  className?: string;
};

function UserImage({  userImg, widthHeight, className }: Props) {
  let tempUser = {} as IUser
  if(userImg){
  tempUser  = userImg
  } else {
  const { user } = useAuthAuthorization()
  tempUser = user
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.dev.local/api";
  const isValidPhoto = tempUser?.url_photo && tempUser.url_photo !== "string" && tempUser.url_photo.trim() !== "";
  const userPhoto = isValidPhoto ? `${baseUrl}/${tempUser.url_photo}` : `${baseUrl}/images/default.png`;

  
 return (tempUser ?
    <Image
      className={`rounded-full ${className || ''}`}
      src={userPhoto}
      width={widthHeight}
      height={widthHeight}
      priority={true}
      alt={`${tempUser.first_name} ${tempUser.last_name} profile picture`}
    /> : 
    <HiOutlineUserCircle />
  );
};

export default UserImage;
