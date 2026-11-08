import "./Budgets.css";
import { Wallet, Target, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

function Budgets() {

    const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem("budgets");

    return savedBudgets
        ? JSON.parse(savedBudgets)
        : [
            { category: "Food", limit: 5000 },
            { category: "Travel", limit: 2000 },
            { category: "Bills", limit: 3000 },
            { category: "Shopping", limit: 2000 },
            { category: "Health", limit: 1000 },
            { category: "Other", limit: 2000 },
        ];
    });

    useEffect(() => {
        localStorage.setItem("budgets", JSON.stringify(budgets));
        }, [budgets]);

    const expenseRecords = JSON.parse(
        localStorage.getItem("expenseRecords") || "[]"
    );
    
    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthlyExpenses = expenseRecords.filter(
        (expense) => expense.date.slice(0, 7) === currentMonth
    );

    const totalBudget = budgets.reduce(
        (total, budget) => total + budget.limit,
        0
    );

    const totalSpent = monthlyExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="budgets-page">
      <div className="budgets-heading">
        <div>
          <h2>Budget Management</h2>
          <p>Plan and monitor your monthly spending limits.</p>
        </div>
      </div>

      <div className="budget-summary">
        <div className="budget-summary-card">
            <Wallet size={22} />
            <p>Total Budget</p>
            <h2>₱{totalBudget.toLocaleString("en-PH")}</h2>
        </div>

        <div className="budget-summary-card">
            <TrendingUp size={22} />
            <p>Total Spent</p>
            <h2>₱{totalSpent.toLocaleString("en-PH")}</h2>
        </div>

        <div className="budget-summary-card">
            <Target size={22} />
            <p>Remaining Budget</p>
            <h2>₱{remainingBudget.toLocaleString("en-PH")}</h2>
        </div>
      </div>

      <div className="budget-list">
        <div className="budget-list-header">
            <h3>Category Budgets</h3>
            <p>Your monthly spending progress</p>
        </div>

        <div className="budget-grid">
            {budgets.map((budget) => {
            const spent = monthlyExpenses
                .filter((expense) => expense.category === budget.category)
                .reduce((total, expense) => total + expense.amount, 0);

            const percentage = Math.min(
                (spent / budget.limit) * 100,
                100
            );

            return (
                <div className="budget-card" key={budget.category}>
                    <div className="budget-card-header">
                        <h4>{budget.category}</h4>
                        <span>{percentage.toFixed(0)}%</span>
                    </div>

                <h3>
                    ₱{spent.toLocaleString("en-PH")}
                    <span> / ₱{budget.limit.toLocaleString("en-PH")}</span>
                </h3>

                <div className="budget-progress">
                    <div
                        className={`budget-progress-fill ${
                        spent > budget.limit ? "over-budget" : ""
                        }`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                <p className={spent > budget.limit ? "budget-warning" : ""}>
                    {spent > budget.limit
                        ? `Over budget by ₱${(spent - budget.limit).toLocaleString("en-PH")}`
                        : `₱${(budget.limit - spent).toLocaleString("en-PH")} remaining`}
                </p>
            </div>
            );
            })}
        </div>
      </div>
    </div>
  );
}

export default Budgets;