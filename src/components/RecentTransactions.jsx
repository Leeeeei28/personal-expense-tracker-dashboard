import {
  ShoppingBag,
  Car,
  Wallet,
  Receipt,
} from "lucide-react";

import "./RecentTransactions.css";

function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      title: "Grocery Shopping",
      category: "Food",
      date: "Nov 08, 2026",
      amount: -1500,
      icon: ShoppingBag,
    },
    {
      id: 2,
      title: "Transportation",
      category: "Travel",
      date: "Nov 07, 2026",
      amount: -250,
      icon: Car,
    },
    {
      id: 3,
      title: "Monthly Allowance",
      category: "Income",
      date: "Nov 06, 2026",
      amount: 5000,
      icon: Wallet,
    },
    {
      id: 4,
      title: "Electricity Bill",
      category: "Bills",
      date: "Nov 05, 2026",
      amount: -1200,
      icon: Receipt,
    },
  ];

  return (
    <div className="transactions-card">
      <div className="section-header">
        <div>
          <h3>Recent Transactions</h3>
          <p>Your latest financial activities</p>
        </div>

        <button className="view-all-btn">View All</button>
      </div>

      <div className="transactions-list">
        {transactions.map((transaction) => {
          const Icon = transaction.icon;

          return (
            <div className="transaction-item" key={transaction.id}>
              <div className="transaction-info">
                <div className="transaction-icon">
                  <Icon size={19} />
                </div>

                <div>
                  <h4>{transaction.title}</h4>
                  <p>
                    {transaction.category} · {transaction.date}
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
        })}
      </div>
    </div>
  );
}

export default RecentTransactions;
