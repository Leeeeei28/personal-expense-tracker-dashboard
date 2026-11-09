
import { useState, useEffect } from "react";

import {
  ShoppingBag,
  Car,
  Wallet,
  Receipt,
  GraduationCap,
  HeartPulse,
  Film,
  Briefcase,
  ArrowRightLeft,
} from "lucide-react";

import "./RecentTransactions.css";

const categoryIcons = {
  Food: ShoppingBag,
  Travel: Car,
  Transportation: Car,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Health: HeartPulse,
  Education: GraduationCap,
  Entertainment: Film,
  Salary: Briefcase,
  Allowance: Wallet,
  Freelance: Wallet,
  Business: Briefcase,
  Investment: Wallet,
  Other: ArrowRightLeft,
};

function RecentTransactions({ onViewAll }) {
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = () => {
    const income = JSON.parse(
      localStorage.getItem("incomeRecords") || "[]"
    );

    const expenses = JSON.parse(
      localStorage.getItem("expenseRecords") || "[]"
    );

    const combinedTransactions = [
      ...income.map((record) => ({
        ...record,
        type: "income",
        amount: Math.abs(Number(record.amount || 0)),
      })),

      ...expenses.map((record) => ({
        ...record,
        type: "expense",
        amount: -Math.abs(Number(record.amount || 0)),
      })),
    ];

    combinedTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setTransactions(combinedTransactions.slice(0, 5));
  };

  useEffect(() => {
    loadTransactions();

    window.addEventListener("financeDataUpdated", loadTransactions);
    window.addEventListener("storage", loadTransactions);

    return () => {
      window.removeEventListener(
        "financeDataUpdated",
        loadTransactions
      );

      window.removeEventListener("storage", loadTransactions);
    };
  }, []);

  return (
    <div className="transactions-card">
      <div className="section-header">
        <div>
          <h3>Recent Transactions</h3>
          <p>Your latest financial activities</p>
        </div>

        <button
          className="view-all-btn"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>

      <div className="transactions-list">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const Icon =
              transaction.type === "income"
                ? Wallet
                : categoryIcons[transaction.category] || Receipt;

            return (
              <div
                className="transaction-item"
                key={`${transaction.type}-${transaction.id}`}
              >
                <div className="transaction-info">
                  <div className="transaction-icon">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h4>{transaction.title}</h4>
                    <p>
                      {transaction.category} ·{" "}
                      {new Date(
                        `${transaction.date}T00:00:00`
                      ).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <strong
                  className={
                    transaction.amount > 0
                      ? "income-amount"
                      : "expense-amount"
                  }
                >
                  {transaction.amount > 0 ? "+" : "-"}₱
                  {Math.abs(transaction.amount).toLocaleString("en-PH")}
                </strong>
              </div>
            );
          })
        ) : (
          <div className="transactions-empty">
            <p>No transactions yet.</p>
            <span>Your income and expenses will appear here.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;
