"use client"
import Loading from "@/components/custom/Loading";
import { useGetUsersQuery } from "@/lib/features/users/usersApi";
import { IUser } from "@/utils/interface/user_interfaces";
import CustomTableComponent from "./_components/table";
import { allUsersHeadCells } from "./_components/table_utils";

const page = () => {

  const { data, error, isLoading } = useGetUsersQuery("users");

  if (error) return <div>Error loading users</div>;


  const rows = data?.data.map((user: IUser) => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    adress: user.adress,
    role: user.role,
    disabled: user.disabled ? 'Yes' : 'No',
  })) || [];
  interface IData {
    id: number;
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
  }
  if(isLoading) return <Loading />;
  return <CustomTableComponent<IData> data={rows} isLoading={isLoading} headCells={allUsersHeadCells} />;
};

export default page;
