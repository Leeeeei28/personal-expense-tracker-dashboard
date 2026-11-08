import { useState, useEffect } from "react";

import {
  PiggyBank,
  Target,
  TrendingUp,
  Plus,
  X,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import "./Savings.css";

function Savings() {
  // Load saved goals from LocalStorage
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const savedGoals = localStorage.getItem("savingsGoals");

    return savedGoals
      ? JSON.parse(savedGoals)
      : [
          {
            id: 1,
            title: "Emergency Fund",
            target: 20000,
            saved: 5000,
            deadline: "2027-03-01",
          },
          {
            id: 2,
            title: "New Laptop",
            target: 40000,
            saved: 10000,
            deadline: "2027-06-01",
          },
          {
            id: 3,
            title: "Travel Fund",
            target: 15000,
            saved: 3000,
            deadline: "2027-12-01",
          },
        ];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    target: "",
    saved: "",
    deadline: "",
  });

  // Automatically save goals whenever they change
  useEffect(() => {
    localStorage.setItem(
      "savingsGoals",
      JSON.stringify(savingsGoals)
    );
  }, [savingsGoals]);

  // Summary calculations
  const totalSaved = savingsGoals.reduce(
    (total, goal) => total + goal.saved,
    0
  );

  const totalTarget = savingsGoals.reduce(
    (total, goal) => total + goal.target,
    0
  );

  const remainingTarget = Math.max(
    totalTarget - totalSaved,
    0
  );

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Reset and close form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      title: "",
      target: "",
      saved: "",
      deadline: "",
    });
  };

  // Add or update a savings goal
  const handleSubmit = (e) => {
    e.preventDefault();

    const target = Number(formData.target);
    const saved = Number(formData.saved || 0);

    if (
      !formData.title.trim() ||
      !formData.deadline ||
      !Number.isFinite(target) ||
      !Number.isFinite(saved) ||
      target <= 0 ||
      saved < 0
    ) {
      alert("Please enter valid savings goal information.");
      return;
    }

    if (editingId !== null) {
      setSavingsGoals((previousGoals) =>
        previousGoals.map((goal) =>
          goal.id === editingId
            ? {
                ...goal,
                title: formData.title.trim(),
                target,
                saved,
                deadline: formData.deadline,
              }
            : goal
        )
      );
    } else {
      const newGoal = {
        id: Date.now(),
        title: formData.title.trim(),
        target,
        saved,
        deadline: formData.deadline,
      };

      setSavingsGoals((previousGoals) => [
        ...previousGoals,
        newGoal,
      ]);
    }

    handleCancelForm();
  };

  // Open form with existing goal information
  const handleEdit = (goal) => {
    setEditingId(goal.id);

    setFormData({
      title: goal.title,
      target: String(goal.target),
      saved: String(goal.saved),
      deadline: goal.deadline,
    });

    setShowForm(true);
  };

  // Delete a savings goal
  const handleDelete = (goalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this savings goal?"
    );

    if (!confirmed) return;

    setSavingsGoals((previousGoals) =>
      previousGoals.filter((goal) => goal.id !== goalId)
    );
  };

  // Add money to an existing goal
  const handleAddSavings = (goalId) => {
    const input = window.prompt(
      "How much would you like to add to this savings goal?"
    );

    if (input === null || input.trim() === "") return;

    const amount = Number(input);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    setSavingsGoals((previousGoals) =>
      previousGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              saved: goal.saved + amount,
            }
          : goal
      )
    );
  };

  // Format currency
  const formatCurrency = (amount) =>
    `₱${amount.toLocaleString("en-PH", {
      maximumFractionDigits: 2,
    })}`;

  // Format deadline
  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="savings-page">
      {/* Page Heading */}
      <div className="savings-heading">
        <div>
          <h2>Savings Goals</h2>
          <p>
            Set your financial goals and track your progress.
          </p>
        </div>
      </div>

      {/* Add Goal Button */}
      <button
        className="add-savings-btn"
        onClick={() => {
          handleCancelForm();
          setShowForm(true);
        }}
      >
        <Plus size={18} />
        Add Savings Goal
      </button>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="savings-form-card">
          <div className="savings-form-header">
            <h3>
              {editingId !== null
                ? "Edit Savings Goal"
                : "Create Savings Goal"}
            </h3>

            <button
              type="button"
              onClick={handleCancelForm}
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="savings-form-grid">
              <div className="savings-input-group">
                <label>Goal Name</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. New Phone"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="savings-input-group">
                <label>Target Amount (₱)</label>
                <input
                  type="number"
                  name="target"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter target amount"
                  value={formData.target}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="savings-input-group">
                <label>Current Savings (₱)</label>
                <input
                  type="number"
                  name="saved"
                  min="0"
                  step="0.01"
                  placeholder="Enter current savings"
                  value={formData.saved}
                  onChange={handleChange}
                />
              </div>

              <div className="savings-input-group">
                <label>Target Date</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="savings-form-actions">
              <button
                type="button"
                className="cancel-savings-btn"
                onClick={handleCancelForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-savings-btn"
              >
                {editingId !== null
                  ? "Update Goal"
                  : "Save Goal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="savings-summary">
        <div className="savings-summary-card">
          <PiggyBank size={22} />
          <p>Total Saved</p>
          <h2>{formatCurrency(totalSaved)}</h2>
        </div>

        <div className="savings-summary-card">
          <Target size={22} />
          <p>Total Goals</p>
          <h2>{savingsGoals.length}</h2>
        </div>

        <div className="savings-summary-card">
          <TrendingUp size={22} />
          <p>Remaining Target</p>
          <h2>{formatCurrency(remainingTarget)}</h2>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="savings-goals-section">
        <div className="savings-goals-header">
          <div>
            <h3>My Savings Goals</h3>
            <p>
              Track your progress toward each financial goal.
            </p>
          </div>

          <span className="savings-goal-count">
            {savingsGoals.length} Goals
          </span>
        </div>

        <div className="savings-goals-grid">
          {savingsGoals.map((goal) => {
            const percentage = Math.min(
              (goal.saved / goal.target) * 100,
              100
            );

            const isCompleted = goal.saved >= goal.target;

            const remaining = Math.max(
              goal.target - goal.saved,
              0
            );

            return (
              <div className="savings-goal-card" key={goal.id}>
                <div className="savings-goal-top">
                  <h4>{goal.title}</h4>

                  {isCompleted && (
                    <span className="goal-completed">
                      <CheckCircle2 size={15} />
                      Completed
                    </span>
                  )}
                </div>

                <h3>
                  {formatCurrency(goal.saved)}
                  <span> / {formatCurrency(goal.target)}</span>
                </h3>

                <div className="savings-progress">
                  <div
                    className={`savings-progress-fill ${
                      isCompleted ? "completed" : ""
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="savings-goal-progress-info">
                  <span>{percentage.toFixed(0)}% completed</span>
                  <span>
                    {isCompleted
                      ? "Target reached!"
                      : `${formatCurrency(remaining)} remaining`}
                  </span>
                </div>

                <div className="savings-goal-deadline">
                  Target Date: {formatDate(goal.deadline)}
                </div>

                <div className="savings-goal-actions">
                  <button
                    className="add-savings-amount-btn"
                    onClick={() => handleAddSavings(goal.id)}
                  >
                    <Plus size={16} />
                    Add Savings
                  </button>

                  <button
                    className="edit-savings-btn"
                    onClick={() => handleEdit(goal)}
                    aria-label={`Edit ${goal.title}`}
                    title="Edit goal"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="delete-savings-btn"
                    onClick={() => handleDelete(goal.id)}
                    aria-label={`Delete ${goal.title}`}
                    title="Delete goal"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}

          {savingsGoals.length === 0 && (
            <div className="savings-empty-state">
              <PiggyBank size={42} />
              <h3>No Savings Goals Yet</h3>
              <p>
                Start building your savings by creating your first goal.
              </p>

              <button
                className="add-savings-btn"
                onClick={() => setShowForm(true)}
              >
                <Plus size={17} />
                Create Your First Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Savings;