
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

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Overview");

  const [financeData, setFinanceData] = useState({
    income: [],
    expenses: [],
    savings: [],
  });

  // Load financial records from LocalStorage
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

  // Listen for updates from other pages
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

  // Get current month
  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  // Calculate current month's income
  const monthlyIncome = financeData.income
    .filter((record) => record.date?.slice(0, 7) === currentMonth)
    .reduce(
      (total, record) => total + Number(record.amount || 0),
      0
    );

  // Calculate current month's expenses
  const monthlyExpenses = financeData.expenses
    .filter((record) => record.date?.slice(0, 7) === currentMonth)
    .reduce(
      (total, record) => total + Number(record.amount || 0),
      0
    );

  // Calculate all-time balance
  const totalIncome = financeData.income.reduce(
    (total, record) => total + Number(record.amount || 0),
    0
  );

  const totalExpenses = financeData.expenses.reduce(
    (total, record) => total + Number(record.amount || 0),
    0
  );

  const totalBalance = totalIncome - totalExpenses;

  // Calculate total savings
  const totalSavings = financeData.savings.reduce(
    (total, goal) => total + Number(goal.saved || 0),
    0
  );

  // Format currency
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

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <Header />

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
              <RecentTransactions />
            </div>
          </>
        )}

        {activePage === "Income" && <Income />}
        {activePage === "Expenses" && <Expense />}
        {activePage === "Transactions" && <Transactions />}
        {activePage === "Budgets" && <Budgets />}
        {activePage === "Savings" && <Savings />}
        {activePage === "Reports" && <Reports />}
      </main>
    </div>
  );
}

export default App;
