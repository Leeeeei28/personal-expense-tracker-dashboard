import {
  LayoutDashboard,
  Wallet,
  TrendingDown,
  ArrowLeftRight,
  ChartPie,
  PiggyBank,
  ChartNoAxesCombined,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Income", icon: Wallet },
    { name: "Expenses", icon: TrendingDown },
    { name: "Transactions", icon: ArrowLeftRight },
    { name: "Budgets", icon: ChartPie },
    { name: "Savings", icon: PiggyBank },
    { name: "Reports", icon: ChartNoAxesCombined },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Wallet size={24} />
        </div>
        <h2>MyFinance</h2>
      </div>

      <div className="sidebar-menu">
        <p className="menu-label">MENU</p>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                href="#"
                key={item.name}
                className={`nav-item ${
                  item.name === "Overview" ? "active" : ""
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <a href="#" className="nav-item">
          <CircleHelp size={20} />
          <span>Help & Support</span>
        </a>

        <a href="#" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </a>

        <a href="#" className="nav-item logout">
          <LogOut size={20} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
