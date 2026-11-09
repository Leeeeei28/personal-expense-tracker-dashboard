import { useState, useEffect } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./ExpenseChart.css";

const categoryColors = {
  Food: "#F97316",
  Travel: "#3B82F6",
  Transportation: "#3B82F6",
  Bills: "#A78BFA",
  Shopping: "#FBBF24",
  Health: "#EC4899",
  Education: "#06B6D4",
  Entertainment: "#8B5CF6",
  Other: "#34D399",
};

const categoryLabels = {
  Travel: "Transportation",
  Other: "Others",
};

function ExpenseChart() {
  const [expenseRecords, setExpenseRecords] = useState([]);

  const loadExpenses = () => {
    const savedExpenses = JSON.parse(
      localStorage.getItem("expenseRecords") || "[]"
    );

    setExpenseRecords(savedExpenses);
  };

  useEffect(() => {
    loadExpenses();

    window.addEventListener("financeDataUpdated", loadExpenses);
    window.addEventListener("storage", loadExpenses);

    return () => {
      window.removeEventListener("financeDataUpdated", loadExpenses);
      window.removeEventListener("storage", loadExpenses);
    };
  }, []);

  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const monthlyExpenses = expenseRecords.filter(
    (expense) => expense.date?.slice(0, 7) === currentMonth
  );

  const groupedExpenses = monthlyExpenses.reduce((groups, expense) => {
    const category = expense.category || "Other";

    groups[category] =
      (groups[category] || 0) + Number(expense.amount || 0);

    return groups;
  }, {});

  const expenseData = Object.entries(groupedExpenses).map(
    ([category, amount]) => ({
      name: categoryLabels[category] || category,
      amount,
      color: categoryColors[category] || "#9297A8",
    })
  );

  const totalExpenses = expenseData.reduce(
    (total, item) => total + item.amount,
    0
  );

  return (
    <div className="expense-chart-card">
      <div className="section-header">
        <div>
          <h3>Expense Overview</h3>
          <p>Your spending breakdown</p>
        </div>

        <span className="chart-period">This Month</span>
      </div>

      {expenseData.length > 0 ? (
        <>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {expenseData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₱${Number(value).toLocaleString("en-PH")}`
                  }
                  contentStyle={{
                    background: "#202435",
                    border: "1px solid #34394A",
                    borderRadius: "10px",
                    color: "#FFFFFF",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="expense-legend">
            {expenseData.map((item) => (
              <div className="legend-item" key={item.name}>
                <div className="legend-label">
                  <span
                    className="legend-dot"
                    style={{ background: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <strong>
                  ₱{item.amount.toLocaleString("en-PH")}
                </strong>
              </div>
            ))}

            <div className="legend-total">
              <span>Total Expenses</span>
              <strong>
                ₱{totalExpenses.toLocaleString("en-PH")}
              </strong>
            </div>
          </div>
        </>
      ) : (
        <div className="chart-empty">
          <p>No expenses recorded this month.</p>
          <span>Add an expense to see your spending breakdown.</span>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;
