import Image from 'next/image';
import { IUser } from '@/utils/interface/user_interfaces';
import { HiOutlineUserCircle } from 'react-icons/hi';

type Props = {
  user: IUser;
  widthHeight?: number;
  className?: string;
};

function UserImage({ user, widthHeight, className }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.dev.local/api";
  const isValidPhoto = user?.url_photo && user.url_photo !== "string" && user.url_photo.trim() !== "";
  const userPhoto = isValidPhoto ? `${baseUrl}/${user.url_photo}` : `${baseUrl}/images/default.png`;

 return (user ?
    <Image
      className={`rounded-full ${className || ''}`}
      src={userPhoto}
      width={widthHeight}
      height={widthHeight}
      priority={true}
      alt={`${user.first_name} ${user.last_name} profile picture`}
    /> : 
    <HiOutlineUserCircle />
  );
};

export default UserImage;
