import Link from "next/link";
import React from "react";
import Image from "next/image";

type Props = {};

const Logo = (props: Props) => {
  return (
    <div>
      <Link href={"/"}>
        <Image
    width="0"
    height="0"
    sizes="100vw"
    style={{ width: '130px', height: 'auto' }}
          alt="logo"
          src="/assets/logo.png"
        />
      </Link>
    </div>
  );
};

export default Logo;
