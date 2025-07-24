import React, { useEffect } from "react";
import { Divider, Drawer } from "antd";
import { Images } from "@/constants/images.tsx";
import { stringMenu, stringProfile } from "@/constants/strings.ts";
import CustomerAvatar from "@/components/profile/CustomerAvatar.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { MenuItem, useSidebarStore } from "@/stores/sidebarStore.ts";
import { useShallow } from "zustand/shallow";

interface SideBarProps {
  onCloseDrawer: () => void;
  isSidebarOpen: boolean;
  avatar?: string | null;
  onLogout: () => void;
  onShowProfile: () => void;
}

const Sidebar: React.FC<SideBarProps> = ({ onCloseDrawer, isSidebarOpen, avatar, onLogout, onShowProfile }) => {
  const navigate = useNavigate();
  const { sidebarSelectedItem, setSidebarSelectedItem } = useSidebarStore(
    useShallow(state => ({
      sidebarSelectedItem: state.selectedItem,
      setSidebarSelectedItem: state.setSelectedItem
    }))
  );
  // Set active tab when reload/refresh page
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab") as MenuItem;

    if (tab === MenuItem.siteSketches || tab === MenuItem.majorlProject) {
      setSidebarSelectedItem(tab);
    } else {
      setSidebarSelectedItem(MenuItem.siteSketches);
    }
  });

  const siteSketchClassname = `cursor-pointer flex items-center ${sidebarSelectedItem === MenuItem.siteSketches ? "text-orange-600 bg-orange-100" : "text-gray-700"} font-semibold text-sm pt-3 pb-3 rounded-md`;
  const siteMajorClassname = `cursor-pointer flex items-center ${sidebarSelectedItem === MenuItem.majorlProject ? "text-orange-600 bg-orange-100" : "text-gray-700"} font-semibold text-sm pt-3 pb-3 rounded-md`;
  return (
    <Drawer
      title={
        <div className="bg-orange-500 py-4 px-4 flex items-center justify-start h-16 -mx-6 -mt-6 rounded-t-lg">
          <img src={Images.LogoIconCustomerSite} alt="" />
          <img src={Images.LogoLetterCustomerSite} className="w-36 h-3.5 ml-2" alt="" />
        </div>
      }
      placement="left"
      closable={false}
      onClose={onCloseDrawer}
      open={isSidebarOpen}
      width={256}
      styles={{ header: { borderBottom: "none" }, body: { borderBottom: "none", padding: "0px" } }}
    >
      <nav>
        <h3 className="text-gray-500 text-xs font-semibold ml-7">{stringMenu}</h3>
        <ul className="mt-2 ml-3 mr-3">
          <li
            className={siteSketchClassname}
            onClick={() => {
              setSidebarSelectedItem(MenuItem.siteSketches);
              onCloseDrawer();
              navigate(`${ROUTES.MAIN}?tab=${sidebarSelectedItem}`);
            }}
          >
            {sidebarSelectedItem === MenuItem.siteSketches ? (
              <span className="block w-[3px] h-4 bg-orange-600 mr-3 rounded-full"></span>
            ) : (
              <span className="block w-[3px] h-4 mr-3"></span>
            )}
            Site sketches
          </li>
          <li
            className={siteMajorClassname}
            onClick={() => {
              setSidebarSelectedItem(MenuItem.majorlProject);
              onCloseDrawer();
              navigate(`${ROUTES.MAJOR_PROJECT}?tab=${sidebarSelectedItem}`);
            }}
          >
            {sidebarSelectedItem === MenuItem.majorlProject ? (
              <span className="block w-[3px] h-4 bg-orange-600 mr-3 rounded-full"></span>
            ) : (
              <span className="block w-[3px] h-4 mr-3"></span>
            )}
            Major projects
          </li>
        </ul>

        <Divider />

        <h3 className="text-gray-500 text-xs font-semibold ml-7">{stringProfile}</h3>
        <ul className="ml-7">
          <li className="flex items-center text-gray-700 font-semibold text-sm gap-2 mt-5 cursor-pointer" onClick={onShowProfile}>
            <CustomerAvatar imageSrc={avatar} size="20px" />
            Edit profile
          </li>
          <li className="flex items-center text-gray-700 font-semibold text-sm mt-5 cursor-pointer" onClick={onLogout}>
            <img src={Images.IconLogoutForMobile} alt="logout" className="w-5 h-5 mr-2" />
            Sign out
          </li>
        </ul>
      </nav>
    </Drawer>
  );
};

export default Sidebar;
