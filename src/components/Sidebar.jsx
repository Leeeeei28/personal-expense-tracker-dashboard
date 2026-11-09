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

function Sidebar({ activePage, setActivePage, onLogout }) {
  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Income", icon: Wallet },
    { name: "Expenses", icon: TrendingDown },
    { name: "Transactions", icon: ArrowLeftRight },
    { name: "Budgets", icon: ChartPie },
    { name: "Savings", icon: PiggyBank },
    { name: "Reports", icon: ChartNoAxesCombined },
  ];

  const bottomItems = [
    { name: "Help & Support", icon: CircleHelp },
    { name: "Settings", icon: Settings },
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
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        {bottomItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}

        <button
          onClick={onLogout}
          className="nav-item logout"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
