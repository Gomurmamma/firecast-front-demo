import React, { useRef, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IconContext, IconType } from "react-icons";
import {
  MdMenu,
  MdSpaceDashboard,
  MdGraphicEq,
  MdMap,
  MdOutlineSettings,
} from "react-icons/md";

import "../styles/Navbar.scss";

// Types
interface NavLinkType {
  name: string;
  path: string;
  icon: IconType;
}

// Navigation Names/Links
const navLinks: NavLinkType[] = [
  { name: "Home", path: "/", icon: MdSpaceDashboard },
  { name: "Map", path: "/map", icon: MdMap },
  { name: "Graph", path: "/graph", icon: MdGraphicEq },
  { name: "Settings", path: "/settings", icon: MdOutlineSettings },
];

let location = window.location.pathname;

console.log("location: ", location);

const NavbarLinks: React.FC = () => {
  return (
    <div className="navlinks">
      {navLinks.map((link) => (
        <div className="link">
          <NavLink to={link.path}>
            <IconContext.Provider
              value={{
                className:
                  location == link.path ? "link-icon active" : "link-icon",
              }}
            >
              <div>
                <link.icon />
              </div>
            </IconContext.Provider>
            <div className="link-name">
              <span>{link.name}</span>
            </div>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default NavbarLinks;
