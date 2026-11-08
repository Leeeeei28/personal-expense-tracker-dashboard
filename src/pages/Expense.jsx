import { useState, useEffect } from "react";

import {
  Wallet,
  TrendingDown,
  CalendarDays,
  Plus,
  X,
  Trash2,
  Pencil,
} from "lucide-react";

import "./Expense.css";

function Expense() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [expenseRecords, setExpenseRecords] = useState(() => {
  const savedExpenses = localStorage.getItem("expenseRecords");

  return savedExpenses
    ? JSON.parse(savedExpenses)
    : [
        {
          id: 1,
          title: "Grocery Shopping",
          category: "Food",
          date: "2026-11-08",
          amount: 1500,
        },
        {
          id: 2,
          title: "Transportation",
          category: "Travel",
          date: "2026-11-07",
          amount: 250,
        },
        {
          id: 3,
          title: "Electricity Bill",
          category: "Bills",
          date: "2026-11-05",
          amount: 1200,
        },
        {
          id: 4,
          title: "New Shirt",
          category: "Shopping",
          date: "2026-11-03",
          amount: 800,
        },
      ];
    });

    useEffect(() => {
      localStorage.setItem(
      "expenseRecords",
      JSON.stringify(expenseRecords)
    );
    }, [expenseRecords]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const totalExpenses = expenseRecords.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const expenseData = {
    title: formData.title,
    category: formData.category,
    amount: Number(formData.amount),
    date: formData.date,
  };

  if (editingId !== null) {
    setExpenseRecords((previousRecords) =>
      previousRecords.map((expense) =>
        expense.id === editingId
          ? { ...expense, ...expenseData }
          : expense
      )
    );
  } else {
    setExpenseRecords((previousRecords) => [
      {
        id: Date.now(),
        ...expenseData,
      },
      ...previousRecords,
    ]);
  }

  handleCancelForm();
  };

  const handleDelete = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this expense?"
  );

  if (confirmDelete) {
    setExpenseRecords((previousRecords) =>
      previousRecords.filter((expense) => expense.id !== id)
    );
  }
};

const handleEdit = (expense) => {
  setEditingId(expense.id);

  setFormData({
    title: expense.title,
    category: expense.category,
    amount: expense.amount,
    date: expense.date,
  });

  setShowForm(true);
};

const handleCancelForm = () => {
  setShowForm(false);
  setEditingId(null);

  setFormData({
    title: "",
    category: "Food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
};

  return (
    <div className="expense-page">
      <div className="expense-heading">
        <div>
          <h2>Expense Management</h2>
          <p>Track and manage your spending.</p>
        </div>

        <button
          className="add-expense-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {showForm && (
        <div className="expense-form-card">
          <div className="expense-form-header">
            <h3>{editingId !== null ? "Edit Expense" : "Add New Expense"}</h3>

            <button
              type="button"
              onClick={handleCancelForm}
              className="close-expense-form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="expense-form-grid">
              <div className="expense-input-group">
                <label>Expense Source</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Grocery Shopping"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="expense-input-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Food">Food</option>
                  <option value="Travel">Transportation</option>
                  <option value="Bills">Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="expense-input-group">
                <label>Amount (₱)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="expense-input-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="save-expense-btn">
              {editingId !== null ? "Update Expense" : "Save Expense"}
            </button>
          </form>
        </div>
      )}

      <div className="expense-summary">
        <div className="expense-summary-card">
          <div className="expense-summary-icon">
            <Wallet size={22} />
          </div>

          <p>Total Expenses</p>
          <h2>₱{totalExpenses.toLocaleString("en-PH")}</h2>
          <span>All recorded expenses</span>
        </div>

        <div className="expense-summary-card">
          <div className="expense-summary-icon">
            <TrendingDown size={22} />
          </div>

          <p>Expense Records</p>
          <h2>{expenseRecords.length}</h2>
          <span>Recorded transactions</span>
        </div>
      </div>

      <div className="expense-records">
        <div className="expense-records-header">
          <div>
            <h3>Expense History</h3>
            <p>Your recorded spending activities</p>
          </div>

          <span className="expense-period">
            <CalendarDays size={15} />
            All Records
          </span>
        </div>

        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>EXPENSE SOURCE</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {expenseRecords.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>

                  <td>
                    <span className="expense-category">
                      {expense.category}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      `${expense.date}T00:00:00`
                    ).toLocaleDateString("en-PH", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="expense-table-amount">
                    -₱{expense.amount.toLocaleString("en-PH")}
                  </td>

                  <td>
                    <div className="expense-actions">
                    <button
                      className="edit-expense-btn"
                      onClick={() => handleEdit(expense)}
                      title="Edit expense"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="delete-expense-btn"
                      onClick={() => handleDelete(expense.id)}
                      title="Delete expense"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Expense;
