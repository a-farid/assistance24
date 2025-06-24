import React from "react";
import CreateUserForm from "./_components/CreateUserForm";
import { getTranslations } from "next-intl/server";

type Props = {};
// test
const page = async (props: Props) => {
  const t = await getTranslations('CreateUserPage')
  return (
    <div>
      <h2>{t('title')}</h2>
      <CreateUserForm />
    </div>
  );
};

export default page;
