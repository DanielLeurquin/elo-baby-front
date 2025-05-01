import React, { useState } from "react";
import clsx from "clsx";
import { MdHistory } from "react-icons/md";
import { MdSportsSoccer } from "react-icons/md";
import { MdOutlineLeaderboard } from "react-icons/md";
import { IoIosMan } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function MobileNav() {

  //get path 
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const lastPathPart = pathParts[pathParts.length - 1];

  const [activeTab, setActiveTab] = useState(lastPathPart);

  const navItems = [
    { key: "profile", icon: <IoIosMan  size={32}/>},
    { key: "game", icon: <MdSportsSoccer size={32} /> },
    { key: "leaderboard", icon: <MdOutlineLeaderboard  size={32}/> },
    { key: "history", icon: <MdHistory size={32}/> },
  ];

  const navigate = useNavigate();

  return (
    <nav className="z-0 fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full flex justify-between items-center w-[90%] max-w-md shadow-lg">
      {navItems.map(({ key, icon }) => {
        const isActive = activeTab === key;

        return (
          <button
            key={key}
            onClick={() => {setActiveTab(key); navigate(`/${key}`)}}
            className={clsx(
              "relative w-14 h-6 flex items-center justify-center transition-all duration-300",
              {
                "-translate-y-3 scale-110": isActive,
              }
            )}
          >
            {isActive && (
              <span className="absolute w-12 h-12 bg-primary-500 rounded-full z-0" />
            )}
            <span
              className={clsx(
                "text-xl z-0 transition-colors duration-300",
                {
                  "text-white": isActive,
                  "text-gray-400 hover:text-primary-500": !isActive,
                }
              )}
            >
              {icon}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileNav;
