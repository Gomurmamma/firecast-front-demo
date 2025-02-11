import React, { useRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IconContext } from "react-icons";
import { MdNotifications } from "react-icons/md";

import "../styles/Navbar.scss";

const NavbarHeader: React.FC = () => {
  return (
    <div className="header">
      <NavLink to="/">
        <div className="logo"></div>
      </NavLink>
      {/* rest of links */}
      <div className="links">
        <NavLink to="/">
          <IconContext.Provider value={{ className: "notif" }}>
            <div>
              <MdNotifications />
            </div>
          </IconContext.Provider>
        </NavLink>
        <div className="profile">
          <div className="avatar"></div>
          <div className="username">
            <span>My Profile Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarHeader;
