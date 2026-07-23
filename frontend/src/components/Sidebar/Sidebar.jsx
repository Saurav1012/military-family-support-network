import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaComments,
  FaBook,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="logo">

        <h4>🪖 Military</h4>

        <small>Support Network</small>

      </div>

      <nav>

        <NavLink to="/dashboard" className="menu-item">
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/community" className="menu-item">
          <FaUsers />
          <span>Community</span>
        </NavLink>

        <NavLink to="/forum" className="menu-item">
          <FaComments />
          <span>Forums</span>
        </NavLink>

        <NavLink to="/resources" className="menu-item">
          <FaBook />
          <span>Resources</span>
        </NavLink>

        <NavLink to="/events" className="menu-item">
          <FaCalendarAlt />
          <span>Events</span>
        </NavLink>

        <NavLink to="/profile" className="menu-item">
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;