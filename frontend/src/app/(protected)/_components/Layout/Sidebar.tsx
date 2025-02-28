import SideBar_routes from "./SideBar_routes";
import Logo from "./Logo";

type Props = {};

const Sidebar = ({}: Props) => {
  return (
    <>
      <div className="h-full md:w-full w-full border-r border-black flex flex-col overflow-y-auto dark:border-gray-500 shadow-sm bg-gradient-global">
        <div className="p-6">
          <Logo />
        </div>
        <div className="flex flex-col h-full">
          <SideBar_routes />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
