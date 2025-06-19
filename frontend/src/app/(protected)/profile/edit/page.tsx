type Props = {};
import Button from "@mui/material/Button";
import Link from "next/link";
import EditProfileForm from "./_EditProfileForm";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
  description: "Login to access your account",
};

async function EditProfile({}: Props) {
  const t = await getTranslations("ProfilePage");
  return (
    <div className="border p-20 mx-auto mt-5 rounded-lg max-w-[600px]">
      <div>
        <h1 className="w-full text-center font-bold text-[20px] mb-5">{t("edit_title")}</h1>
      </div>
      <div>
        <div className=" w-full">
          <EditProfileForm />
          <hr />
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
