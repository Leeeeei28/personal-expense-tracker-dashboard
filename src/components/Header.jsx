import { Bell, UserCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-welcome">
        <h1>Welcome back!</h1>
        <p>Here's your financial overview today.</p>
      </div>

      <div className="header-actions">
        <span className="header-date">
          {new Date().toLocaleDateString("en-PH", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <ThemeToggle />

        <button className="header-icon notification">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile">
          <UserCircle size={32} />
          <div>
            <h4>My Account</h4>
            <p>Personal User</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
