
import { useState, useEffect } from "react";

import {
  Bell,
  UserCircle,
  Check,
  CheckCheck,
  Settings,
  Wallet,
  Receipt,
  AlertTriangle,
  X,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function Header({ onNavigate }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    return JSON.parse(localStorage.getItem("readNotifications") || "[]");
  });

  const loadNotifications = () => {
    const income = JSON.parse(localStorage.getItem("incomeRecords") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenseRecords") || "[]");
    const budgets = JSON.parse(localStorage.getItem("budgets") || "[]");

    const activityNotifications = [
      ...income.map((item) => ({
        id: `income-${item.id}`,
        title: "Income added",
        message: `${item.title} — ₱${Number(item.amount).toLocaleString("en-PH")}`,
        date: item.date,
        type: "income",
      })),
      ...expenses.map((item) => ({
        id: `expense-${item.id}`,
        title: "Expense recorded",
        message: `${item.title} — ₱${Number(item.amount).toLocaleString("en-PH")}`,
        date: item.date,
        type: "expense",
      })),
    ];

    const currentMonth = new Date().toISOString().slice(0, 7);

    budgets.forEach((budget) => {
      const spent = expenses
        .filter(
          (expense) =>
            expense.category === budget.category &&
            expense.date?.slice(0, 7) === currentMonth
        )
        .reduce((total, expense) => total + Number(expense.amount || 0), 0);

      if (spent > Number(budget.limit)) {
        activityNotifications.push({
          id: `budget-${budget.category}-${currentMonth}`,
          title: "Budget exceeded",
          message: `${budget.category} spending is over its ₱${Number(budget.limit).toLocaleString("en-PH")} limit.`,
          date: currentMonth,
          type: "budget",
        });
      }
    });

    activityNotifications.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setNotifications(activityNotifications.slice(0, 10));
  };

  useEffect(() => {
    loadNotifications();

    window.addEventListener("financeDataUpdated", loadNotifications);
    window.addEventListener("storage", loadNotifications);

    return () => {
      window.removeEventListener("financeDataUpdated", loadNotifications);
      window.removeEventListener("storage", loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter(
    (item) => !readIds.includes(item.id)
  ).length;

  const markAsRead = (id) => {
    const updated = [...new Set([...readIds, id])];
    setReadIds(updated);
    localStorage.setItem("readNotifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((item) => item.id);
    setReadIds((previous) => {
      const combined = [...new Set([...previous, ...updated])];
      localStorage.setItem("readNotifications", JSON.stringify(combined));
      return combined;
    });
  };

  const getNotificationIcon = (type) => {
    if (type === "income") return <Wallet size={17} />;
    if (type === "expense") return <Receipt size={17} />;
    return <AlertTriangle size={17} />;
  };

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

        <div className="header-dropdown-wrapper">
          <button
            className="header-icon notification"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAccount(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>

          {showNotifications && (
            <div className="header-dropdown notification-dropdown">
              <div className="dropdown-heading">
                <div>
                  <h3>Notifications</h3>
                  <p>{unreadCount} unread notifications</p>
                </div>
                <button
                  className="dropdown-close"
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {notifications.length > 0 ? (
                <>
                  <button
                    className="mark-all-btn"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={15} /> Mark all as read
                  </button>

                  <div className="notification-list">
                    {notifications.map((item) => {
                      const isRead = readIds.includes(item.id);

                      return (
                        <div
                          className={`notification-item ${isRead ? "read" : "unread"}`}
                          key={item.id}
                        >
                          <div className={`notification-item-icon ${item.type}`}>
                            {getNotificationIcon(item.type)}
                          </div>

                          <div className="notification-item-content">
                            <h4>{item.title}</h4>
                            <p>{item.message}</p>
                            <span>{item.date}</span>
                          </div>

                          {!isRead && (
                            <button
                              className="mark-read-btn"
                              onClick={() => markAsRead(item.id)}
                              aria-label="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="notification-empty">
                  <Bell size={25} />
                  <p>You're all caught up!</p>
                  <span>No notifications yet.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="header-dropdown-wrapper">
          <button
            className="header-profile"
            onClick={() => {
              setShowAccount(!showAccount);
              setShowNotifications(false);
            }}
          >
            <UserCircle size={32} />
            <div>
              <h4>My Account</h4>
              <p>Personal User</p>
            </div>
          </button>

          {showAccount && (
            <div className="header-dropdown account-dropdown">
              <div className="account-dropdown-info">
                <UserCircle size={38} />
                <div>
                  <h3>My Account</h3>
                  <p>Personal User</p>
                </div>
              </div>

              <div className="account-details">
                <span>Account Type</span>
                <strong>Personal Expense Tracker</strong>
                <span>Currency</span>
                <strong>Philippine Peso (₱)</strong>
              </div>

              <button
                className="account-settings-btn"
                onClick={() => {
                  setShowAccount(false);
                  onNavigate?.("Settings");
                }}
              >
                <Settings size={17} />
                Open Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
