
import { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ChartPie,
} from "lucide-react";

import "./Reports.css";

const COLORS = [
  "#F97316",
  "#60A5FA",
  "#4ADE80",
  "#A78BFA",
  "#FACC15",
  "#F87171",
  "#2DD4BF",
  "#C084FC",
];

function Reports() {
  // Get actual records from LocalStorage
  const incomeRecords = JSON.parse(
    localStorage.getItem("incomeRecords") || "[]"
  );

  const expenseRecords = JSON.parse(
    localStorage.getItem("expenseRecords") || "[]"
  );

  // Selected month for expense breakdown
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  // Format currency
  const formatCurrency = (amount) =>
    `₱${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Convert date into YYYY-MM
  const getMonthKey = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "";

    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  // Get current month
  const currentDate = new Date();

  const currentMonth = getMonthKey(
    `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-01`
  );

  // Current month income and expenses
  const currentMonthIncome = incomeRecords
    .filter((record) => getMonthKey(record.date) === currentMonth)
    .reduce((total, record) => total + Number(record.amount || 0), 0);

  const currentMonthExpenses = expenseRecords
    .filter((record) => getMonthKey(record.date) === currentMonth)
    .reduce((total, record) => total + Number(record.amount || 0), 0);

  const netCashFlow = currentMonthIncome - currentMonthExpenses;

  // Generate last six months of income and expenses
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - (5 - index),
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth();

    const getTotal = (records) =>
      records
        .filter((record) => {
          const recordDate = new Date(`${record.date}T00:00:00`);

          return (
            !Number.isNaN(recordDate.getTime()) &&
            recordDate.getFullYear() === year &&
            recordDate.getMonth() === month
          );
        })
        .reduce(
          (total, record) => total + Number(record.amount || 0),
          0
        );

    return {
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      income: getTotal(incomeRecords),
      expenses: getTotal(expenseRecords),
    };
  });

  // Expense breakdown for selected month
  const selectedExpenses = expenseRecords.filter(
    (record) => getMonthKey(record.date) === selectedMonth
  );

  const categoryTotals = selectedExpenses.reduce(
    (totals, record) => {
      const category = record.category || "Other";

      totals[category] =
        (totals[category] || 0) + Number(record.amount || 0);

      return totals;
    },
    {}
  );

  const categoryData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  const totalSelectedExpenses = categoryData.reduce(
    (total, item) => total + item.amount,
    0
  );

  // Month label
  const selectedMonthLabel = selectedMonth
    ? new Date(`${selectedMonth}-01T00:00:00`).toLocaleDateString(
        "en-PH",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "";

  return (
    <div className="reports-page">
      {/* Page Heading */}
      <div className="reports-heading">
        <div>
          <h2>Reports & Analytics</h2>
          <p>
            Analyze your financial performance and spending habits.
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="reports-summary">
        <div className="reports-summary-card">
          <div className="reports-summary-icon income-icon">
            <TrendingUp size={22} />
          </div>

          <p>Monthly Income</p>
          <h3>{formatCurrency(currentMonthIncome)}</h3>
          <span>Current month</span>
        </div>

        <div className="reports-summary-card">
          <div className="reports-summary-icon expense-icon">
            <TrendingDown size={22} />
          </div>

          <p>Monthly Expenses</p>
          <h3>{formatCurrency(currentMonthExpenses)}</h3>
          <span>Current month</span>
        </div>

        <div className="reports-summary-card">
          <div className="reports-summary-icon balance-icon">
            <Wallet size={22} />
          </div>

          <p>Net Cash Flow</p>
          <h3
            className={
              netCashFlow < 0 ? "negative-balance" : "positive-balance"
            }
          >
            {formatCurrency(netCashFlow)}
          </h3>
          <span>Income minus expenses</span>
        </div>
      </div>

      {/* Monthly Income vs Expenses */}
      <div className="reports-chart-card">
        <div className="reports-card-heading">
          <div>
            <h3>Monthly Income vs. Expenses</h3>
            <p>Compare your income and expenses over the last six months.</p>
          </div>
        </div>

        <div className="reports-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2A3040"
              />

              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                tickLine={false}
              />

              <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                tickFormatter={(value) => `₱${value / 1000}k`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1F2E",
                  border: "1px solid #2A3040",
                  borderRadius: "8px",
                  color: "#F5F5F5",
                }}
                formatter={(value) => formatCurrency(value)}
              />

              <Legend />

              <Bar
                dataKey="income"
                name="Income"
                fill="#F97316"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#60A5FA"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="reports-chart-card reports-breakdown-card">
        <div className="reports-card-heading reports-breakdown-heading">
          <div>
            <div className="reports-title-with-icon">
              <ChartPie size={20} />
              <h3>Expense Breakdown</h3>
            </div>

            <p>See which categories take up your spending.</p>
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="reports-month-filter"
          />
        </div>

        <div className="reports-breakdown-content">
          <div className="reports-pie-chart">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={65}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1F2E",
                      border: "1px solid #2A3040",
                      borderRadius: "8px",
                      color: "#F5F5F5",
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="reports-empty-chart">
                <ChartPie size={38} />
                <p>No expense data for this month.</p>
              </div>
            )}
          </div>

          <div className="reports-category-list">
            <div className="reports-category-total">
              <p>Total Expenses</p>
              <h3>{formatCurrency(totalSelectedExpenses)}</h3>
              <span>{selectedMonthLabel}</span>
            </div>

            {categoryData.length > 0 ? (
              categoryData
                .sort((a, b) => b.amount - a.amount)
                .map((item) => {
                  const originalIndex = categoryData.findIndex(
                    (category) => category.category === item.category
                  );

                  const percentage =
                    totalSelectedExpenses > 0
                      ? (item.amount / totalSelectedExpenses) * 100
                      : 0;

                  return (
                    <div
                      className="reports-category-item"
                      key={item.category}
                    >
                      <div className="reports-category-info">
                        <span
                          className="reports-category-dot"
                          style={{
                            backgroundColor:
                              COLORS[originalIndex % COLORS.length],
                          }}
                        ></span>

                        <span>{item.category}</span>

                        <strong>{percentage.toFixed(1)}%</strong>
                      </div>

                      <p>{formatCurrency(item.amount)}</p>
                    </div>
                  );
                })
            ) : (
              <p className="reports-no-categories">
                Add expenses to see your category breakdown.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
