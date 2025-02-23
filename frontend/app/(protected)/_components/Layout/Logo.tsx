import Link from "next/link";
import React from "react";
import Image from "next/image";

type Props = {};

const Logo = (props: Props) => {
  return (
    <div>
      <Link href={"/"}>
        <Image
          width={130}
          height={130}
          alt="logo"
          src="/assets/logo.png"
        />
      </Link>
    </div>
  );
};

export default Logo;
