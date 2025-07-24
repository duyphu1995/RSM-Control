import React from "react";
import { Images } from "@/constants/images.tsx";

interface ProfileImageWithEditProps {
  imageSrc?: string | null;
  onClickAvatar?: () => void;
  size: string;
}

const CustomerAvatar: React.FC<ProfileImageWithEditProps> = ({ imageSrc, size, onClickAvatar }) => {
  const styles = `relative rounded-full flex-shrink-0 ${onClickAvatar ? "cursor-pointer" : ""}`;
  return (
    <div className={styles} onClick={onClickAvatar} style={{ width: size, height: size }}>
      <img src={imageSrc ? imageSrc : Images.AvatarProfile} alt="Profile" className="w-full h-full object-cover rounded-full" />
    </div>
  );
};

export default CustomerAvatar;
