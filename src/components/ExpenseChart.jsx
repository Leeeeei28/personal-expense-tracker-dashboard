import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./ExpenseChart.css";

function ExpenseChart() {
  const expenseData = [
    { name: "Food", amount: 2500, color: "#F97316" },
    { name: "Transportation", amount: 1200, color: "#3B82F6" },
    { name: "Bills", amount: 1800, color: "#A78BFA" },
    { name: "Shopping", amount: 1000, color: "#FBBF24" },
    { name: "Others", amount: 500, color: "#34D399" },
  ];

  return (
    <div className="expense-chart-card">
      <div className="section-header">
        <div>
          <h3>Expense Overview</h3>
          <p>Your spending breakdown</p>
        </div>
        <span className="chart-period">This Month</span>
      </div>

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
              formatter={(value) => `₱${value.toLocaleString("en-PH")}`}
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
      </div>
    </div>
  );
}

export default ExpenseChart;
