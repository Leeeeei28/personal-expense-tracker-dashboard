import { useState } from "react";

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

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Overview");

  const summaryData = [
    {
      title: "Total Balance",
      amount: "₱25,450",
      icon: Wallet,
      color: "#4ADE80",
      description: "Available balance",
    },
    {
      title: "Total Income",
      amount: "₱30,000",
      icon: TrendingUp,
      color: "#60A5FA",
      description: "This month",
    },
    {
      title: "Total Expenses",
      amount: "₱7,000",
      icon: TrendingDown,
      color: "#F87171",
      description: "This month",
    },
    {
      title: "Total Savings",
      amount: "₱5,000",
      icon: PiggyBank,
      color: "#FBBF24",
      description: "Savings goal progress",
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
      </main>
    </div>
  );
}

export default App;
