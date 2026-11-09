import { useState, useEffect } from "react";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import ExpenseChart from "./components/ExpenseChart";
import RecentTransactions from "./components/RecentTransactions";

import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Savings from "./pages/Savings";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Overview");

  const [financeData, setFinanceData] = useState({
    income: [],
    expenses: [],
    savings: [],
  });

  const loadFinanceData = () => {
    const income = JSON.parse(
      localStorage.getItem("incomeRecords") || "[]"
    );

    const expenses = JSON.parse(
      localStorage.getItem("expenseRecords") || "[]"
    );

    const savings = JSON.parse(
      localStorage.getItem("savingsGoals") || "[]"
    );

    setFinanceData({
      income,
      expenses,
      savings,
    });
  };

  useEffect(() => {
    loadFinanceData();

    window.addEventListener(
      "financeDataUpdated",
      loadFinanceData
    );

    window.addEventListener("storage", loadFinanceData);

    return () => {
      window.removeEventListener(
        "financeDataUpdated",
        loadFinanceData
      );

      window.removeEventListener("storage", loadFinanceData);
    };
  }, []);

  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const monthlyIncome = financeData.income
    .filter((record) => record.date?.slice(0, 7) === currentMonth)
    .reduce(
      (total, record) => total + Number(record.amount || 0),
      0
    );

  const monthlyExpenses = financeData.expenses
    .filter((record) => record.date?.slice(0, 7) === currentMonth)
    .reduce(
      (total, record) => total + Number(record.amount || 0),
      0
    );

  const totalIncome = financeData.income.reduce(
    (total, record) => total + Number(record.amount || 0),
    0
  );

  const totalExpenses = financeData.expenses.reduce(
    (total, record) => total + Number(record.amount || 0),
    0
  );

  const totalBalance = totalIncome - totalExpenses;

  const totalSavings = financeData.savings.reduce(
    (total, goal) => total + Number(goal.saved || 0),
    0
  );

  const formatCurrency = (amount) =>
    `₱${amount.toLocaleString("en-PH", {
      maximumFractionDigits: 2,
    })}`;

  const summaryData = [
    {
      title: "Total Balance",
      amount: formatCurrency(totalBalance),
      icon: Wallet,
      color: "#4ADE80",
      description: "All-time available balance",
    },
    {
      title: "Total Income",
      amount: formatCurrency(monthlyIncome),
      icon: TrendingUp,
      color: "#60A5FA",
      description: "This month",
    },
    {
      title: "Total Expenses",
      amount: formatCurrency(monthlyExpenses),
      icon: TrendingDown,
      color: "#F87171",
      description: "This month",
    },
    {
      title: "Total Savings",
      amount: formatCurrency(totalSavings),
      icon: PiggyBank,
      color: "#FBBF24",
      description: "Total saved across goals",
    },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to leave MyFinance?"
    );

    if (confirmLogout) {
      setActivePage("Overview");
      alert(
        "You have returned to the dashboard. Login functionality can be added when authentication is implemented."
      );
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Header onNavigate={setActivePage} />

        {activePage === "Overview" && (
          <>
            <div className="dashboard-heading">
              <h2>Dashboard Overview</h2>
              <p>Monitor your financial activities.</p>
            </div>

            <div className="summary-grid">
              {summaryData.map((item) => (
                <SummaryCard key={item.title} {...item} />
              ))}
            </div>

            <div className="dashboard-bottom">
              <ExpenseChart />
              <RecentTransactions
                onViewAll={() => setActivePage("Transactions")}
              />
            </div>
          </>
        )}

        {activePage === "Income" && <Income />}
        {activePage === "Expenses" && <Expense />}
        {activePage === "Transactions" && <Transactions />}
        {activePage === "Budgets" && <Budgets />}
        {activePage === "Savings" && <Savings />}
        {activePage === "Reports" && <Reports />}
        {activePage === "Settings" && <Settings />}
        {activePage === "Help & Support" && <HelpSupport />}
      </main>
    </div>
  );
}

export default App;
