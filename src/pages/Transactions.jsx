import { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const loadTransactions = () => {
      const incomeRecords = JSON.parse(
        localStorage.getItem("incomeRecords") || "[]"
      );

      const expenseRecords = JSON.parse(
        localStorage.getItem("expenseRecords") || "[]"
      );

      const combinedRecords = [
        ...incomeRecords.map((record) => ({
          ...record,
          type: "Income",
        })),

        ...expenseRecords.map((record) => ({
          ...record,
          type: "Expense",
        })),
      ];

      setTransactions(
        combinedRecords.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      );
    };

    loadTransactions();
  }, []);

    const totalIncome = transactions
        .filter((item) => item.type === "Income")
        .reduce((total, item) => total + item.amount, 0);

    const totalExpenses = transactions
        .filter((item) => item.type === "Expense")
        .reduce((total, item) => total + item.amount, 0);

    const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
        filterType === "All" || transaction.type === filterType;

    return matchesSearch && matchesType;
    });

  return (
    <div className="transactions-page">
      <div className="transactions-heading">
        <div>
          <h2>Transactions</h2>
          <p>View all your income and expenses.</p>
        </div>
      </div>

      <div className="transaction-summary">
        <div className="transaction-summary-card">
            <p>Total Income</p>
            <h2 className="income-amount">
                ₱{totalIncome.toLocaleString("en-PH")}
            </h2>
        </div>

        <div className="transaction-summary-card">
            <p>Total Expenses</p>
            <h2 className="expense-amount">
                ₱{totalExpenses.toLocaleString("en-PH")}
            </h2>
        </div>

        <div className="transaction-summary-card">
            <p>Net Cash Flow</p>
            <h2>
                ₱{(totalIncome - totalExpenses).toLocaleString("en-PH")}
            </h2>
        </div>
      </div>

      <div className="transactions-table-card">
        <h3>Transaction History</h3>

        <div className="transaction-filters">
            <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
            >
                <option value="All">All Transactions</option>
                <option value="Income">Income Only</option>
                <option value="Expense">Expenses Only</option>
            </select>
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={`${transaction.type}-${transaction.id}-${index}`}>
                  <td>{transaction.title}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.date}</td>

                  <td>
                    <span className={`transaction-type ${transaction.type.toLowerCase()}`}>
                      {transaction.type === "Income" ? (
                        <ArrowUpCircle size={15} />
                      ) : (
                        <ArrowDownCircle size={15} />
                      )}
                      {transaction.type}
                    </span>
                  </td>

                  <td className={transaction.type === "Income" ? "income-amount" : "expense-amount"}>
                    {transaction.type === "Income" ? "+" : "-"}
                    ₱{transaction.amount.toLocaleString("en-PH")}
                  </td>
                </tr>
              ))}

              {filteredTransactions === 0 && (
                <tr>
                  <td colSpan="5">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;