import Link from "next/link";
import React from "react";
import Image from "next/image";

type Props = {
  width: number;
};

const Logo = ({width}: Props) => {
  return (
    <div>
      <Link href={"/"}>
        <Image
          width="0"
          height="0"
          sizes="100vw"
          style={{ width, height: 'auto' }}
          alt="logo"
          src="/assets/logo.png"
          priority
        />
      </Link>
    </div>
  );
};

export default Logo;
