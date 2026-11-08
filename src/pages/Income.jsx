import { useState, useEffect } from "react";  

import {
  Wallet,
  TrendingUp,
  CalendarDays,
  Plus,
  X,
  Trash2,
  Pencil,
} from "lucide-react";

import "./Income.css";

function Income() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [incomeRecords, setIncomeRecords] = useState(() => {
  const savedIncome = localStorage.getItem("incomeRecords");

  return savedIncome
    ? JSON.parse(savedIncome)
    : [
        {
          id: 1,
          title: "Monthly Allowance",
          category: "Allowance",
          date: "2026-11-06",
          amount: 5000,
        },
        {
          id: 2,
          title: "Freelance Project",
          category: "Freelance",
          date: "2026-11-04",
          amount: 3500,
        },
        {
          id: 3,
          title: "Part-time Work",
          category: "Salary",
          date: "2026-11-01",
          amount: 8000,
        },
      ];
    });

    useEffect(() => {
      localStorage.setItem(
      "incomeRecords",
      JSON.stringify(incomeRecords)
    );

      window.dispatchEvent(new Event("financeDataUpdated"));
    }, [incomeRecords]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Salary",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const totalIncome = incomeRecords.reduce(
    (total, income) => total + income.amount,
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

  const incomeData = {
    title: formData.title,
    category: formData.category,
    amount: Number(formData.amount),
    date: formData.date,
  };

  if (editingId !== null) {
    setIncomeRecords((previousRecords) =>
      previousRecords.map((income) =>
        income.id === editingId
          ? { ...income, ...incomeData }
          : income
      )
    );
  } else {
    setIncomeRecords((previousRecords) => [
      {
        id: Date.now(),
        ...incomeData,
      },
      ...previousRecords,
    ]);
  }

  handleCancelForm();
};

  const handleDelete = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this income record?"
  );

  if (confirmDelete) {
    setIncomeRecords((previousRecords) =>
      previousRecords.filter((income) => income.id !== id)
    );
  }
};

const handleEdit = (income) => {
  setEditingId(income.id);

  setFormData({
    title: income.title,
    category: income.category,
    amount: income.amount,
    date: income.date,
  });

  setShowForm(true);
};

const handleCancelForm = () => {
  setShowForm(false);
  setEditingId(null);

  setFormData({
    title: "",
    category: "Salary",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
};

  return (
    <div className="income-page">
      <div className="income-heading">
        <div>
          <h2>Income Management</h2>
          <p>Track and manage all your incoming money.</p>
        </div>

        <button
          className="add-income-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Income
        </button>
      </div>

      {showForm && (
        <div className="income-form-card">
          <div className="income-form-header">
            <h3>{editingId !== null ? "Edit Income" : "Add New Income"}</h3>

            <button
              type="button"
              onClick={handleCancelForm}
              className="close-income-form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="income-form-grid">
              <div className="income-input-group">
                <label>Income Source</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Monthly Allowance"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="income-input-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Salary">Salary</option>
                  <option value="Allowance">Allowance</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="income-input-group">
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

              <div className="income-input-group">
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

            <button type="submit" className="save-income-btn">
              {editingId !== null ? "Update Income" : "Save Income"}
            </button>
          </form>
        </div>
      )}

      <div className="income-summary">
        <div className="income-summary-card">
          <div className="income-summary-icon">
            <Wallet size={22} />
          </div>
          <p>Total Income</p>
          <h2>₱{totalIncome.toLocaleString("en-PH")}</h2>
          <span>All recorded income</span>
        </div>

        <div className="income-summary-card">
          <div className="income-summary-icon">
            <TrendingUp size={22} />
          </div>
          <p>Income Sources</p>
          <h2>{incomeRecords.length}</h2>
          <span>Recorded income entries</span>
        </div>
      </div>

      <div className="income-records">
        <div className="income-records-header">
          <div>
            <h3>Income History</h3>
            <p>Your recorded income transactions</p>
          </div>

          <span className="income-period">
            <CalendarDays size={15} />
            All Records
          </span>
        </div>

        <div className="income-table-wrapper">
          <table className="income-table">
            <thead>
              <tr>
                <th>INCOME SOURCE</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {incomeRecords.map((income) => (
                <tr key={income.id}>
                  <td>{income.title}</td>
                  <td>
                    <span className="income-category">
                      {income.category}
                    </span>
                  </td>
                  <td>
                    {new Date(
                      `${income.date}T00:00:00`
                    ).toLocaleDateString("en-PH", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="income-table-amount">
                    +₱{income.amount.toLocaleString("en-PH")}
                  </td>
                  <td>
                    <div className="income-actions">
                      <button
                        className="edit-income-btn"
                        onClick={() => handleEdit(income)}
                        title="Edit income"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="delete-income-btn"
                        onClick={() => handleDelete(income.id)}
                        title="Delete income"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {incomeRecords.length === 0 && (
                <tr>
                  <td colSpan="5">No income records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Income;
