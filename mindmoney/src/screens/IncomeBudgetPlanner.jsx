import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./IncomeBudgetPlanner.css";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

const IncomeBudgetPlanner = ({ salary, expenses }) => {
  const navigate = useNavigate();
  const [showRecommendation, setShowRecommendation] = useState(false);

  // ✅ Ensure safe numbers
  const safeSalary = Number(salary || 0);

  // ✅ Redirect if no salary & no expenses
  useEffect(() => {
    if (!salary && expenses.length === 0) {
      Swal.fire({
        title: "⚠️ No Data Found",
        text: "You need to add salary or expenses before viewing the budget planner.",
        icon: "warning",
        confirmButtonText: "⬅️ Back to Dashboard",
        confirmButtonColor: "#2563eb",
        background: "#ffffff",
        color: "#1e293b",
        backdrop: `
          rgba(0,0,0,0.4)
          left top
          no-repeat
        `,
        didOpen: () => {
          document.querySelector("#root").style.filter = "blur(5px)";
        },
        willClose: () => {
          document.querySelector("#root").style.filter = "none";
        },
      }).then(() => {
        navigate("/dashboard", { replace: true });
      });
    }
  }, [salary, expenses, navigate]);

  // ✅ Calculate totals
  const totalSpent = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );
  const savings = safeSalary - totalSpent;

  // ✅ Category totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += Number(exp.amount || 0);
    return acc;
  }, {});

  // ✅ Pie chart data
  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));

  // ✅ Budget Plans Data
  const budgetPlans = [
    {
      title: "📌 50-30-20 Rule",
      breakdown: [
        { category: "Needs (50%)", amount: safeSalary * 0.5, color: "#2563eb" },
        { category: "Wants (30%)", amount: safeSalary * 0.3, color: "#16a34a" },
        { category: "Savings (20%)", amount: safeSalary * 0.2, color: "#f59e0b" },
      ],
    },
    {
      title: "📌 70-20-10 Plan",
      breakdown: [
        { category: "Needs (70%)", amount: safeSalary * 0.7, color: "#2563eb" },
        { category: "Savings (20%)", amount: safeSalary * 0.2, color: "#16a34a" },
        { category: "Wants (10%)", amount: safeSalary * 0.1, color: "#f59e0b" },
      ],
    },
  ];

  // ✅ Suggest best plan
  let suggestedPlanIndex = 0;
  let customNote = "";

  if (safeSalary > 0) {
    const savingsRatio = savings / safeSalary;
    if (savingsRatio >= 0.2) {
      suggestedPlanIndex = 0;
      customNote =
        "💡 You’re saving at least 20% of your income. The 50-30-20 Rule helps maintain this balance while giving you flexibility.";
    } else {
      suggestedPlanIndex = 1;
      customNote =
        "💡 Your savings are below 20%. The 70-20-10 Plan emphasizes essentials and savings for stability.";
    }
  }

  // ✅ Show SweetAlert after first expenses are added
  useEffect(() => {
    if (expenses.length > 0 && !showRecommendation) {
      Swal.fire({
        title: `📌 ${budgetPlans[suggestedPlanIndex].title}`,
        html: `<div style="font-size:1rem; color:#475569; line-height:1.5;">${customNote}</div>`,
        icon: "info",
        confirmButtonText: "Got it ✅",
        confirmButtonColor: "#facc15",
        background: "#ffffff",
        color: "#1e293b",
        backdrop: `
          rgba(0,0,0,0.5)
          left top
          no-repeat
        `,
        didOpen: () => {
          document.querySelector("#root").style.filter = "blur(6px)";
        },
        willClose: () => {
          document.querySelector("#root").style.filter = "none";
        },
      }).then(() => {
        setShowRecommendation(true);
      });
    }
  }, [expenses, showRecommendation, suggestedPlanIndex, customNote]);

  return (
    <div className="planner-container">
      {/* ✅ Financial Summary */}
      <div className="summary-card">
        <h2 className="summary-title">Your Financial Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <h3>Total Salary</h3>
            <p>₹{safeSalary.toLocaleString()}</p>
          </div>
          <div className="summary-item">
            <h3>Total Spent</h3>
            <p>₹{totalSpent.toLocaleString()}</p>
          </div>
          <div className="summary-item">
            <h3>Savings</h3>
            <p>₹{savings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ✅ Category Breakdown */}
      {expenses.length > 0 ? (
        <div className="category-breakdown">
          <h2 className="section-title">Category Wise Breakdown</h2>
          <div className="category-grid">
            {Object.entries(categoryTotals).map(([category, amount], idx) => {
              const percentage = totalSpent
                ? ((amount / totalSpent) * 100).toFixed(1)
                : 0;
              return (
                <div key={idx} className="category-card">
                  <h3>{category}</h3>
                  <p>₹{amount.toLocaleString()}</p>
                  <p className="percentage">{percentage}%</p>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentage}%`,
                        background: COLORS[idx % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="no-expenses-msg">⚠️ No expenses added yet.</p>
      )}

      {/* ✅ Spending Overview */}
      {expenses.length > 0 && (
        <div className="pie-chart">
          <h2 className="section-title">Spending Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, amount }) =>
                  `${category}: ${((amount / safeSalary) * 100).toFixed(1)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) =>
                  `${name}: ₹${Number(value).toLocaleString()}`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ Recommended Budget Plans */}
      {showRecommendation && (
        <div className="budget-recommendations">
          <h2 className="section-title">Recommended Budget Plans</h2>
          <div className="budget-grid">
            {budgetPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`budget-card ${
                  idx === suggestedPlanIndex ? "highlight-card" : "dim-card"
                }`}
              >
                <h3>
                  {plan.title}
                  {idx === suggestedPlanIndex && (
                    <span className="recommended-pill">Recommended</span>
                  )}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={plan.breakdown}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ category, amount }) =>
                        `${category}: ${((amount / safeSalary) * 100).toFixed(
                          1
                        )}%`
                      }
                    >
                      {plan.breakdown.map((item, i) => (
                        <Cell key={i} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) =>
                        `${name}: ₹${Number(value).toLocaleString()}`
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="budget-values">
                  {plan.breakdown.map((item, i) => (
                    <p key={i}>
                      <strong>{item.category}:</strong> ₹
                      {item.amount.toLocaleString()}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Action Buttons */}
      <div className="button-container">
        <div className="button-wrapper">
          <button
            className="add-expenses-btn"
            onClick={() => {
              if (totalSpent > 0) {
                navigate("/add-expenses");
              } else {
                Swal.fire({
                  title: "⚠️ Expenses not added yet",
                  text: "You haven’t added any expenses yet. Please add expenses to view details.",
                  icon: "warning",
                  confirmButtonText: "⬅️ Back to Dashboard",
                  confirmButtonColor: "#2563eb",
                  background: "#ffffff",
                  color: "#1e293b",
                  backdrop: `
                    rgba(0,0,0,0.4)
                    left top
                    no-repeat
                  `,
                  didOpen: () => {
                    document.querySelector("#root").style.filter = "blur(6px)";
                  },
                  willClose: () => {
                    document.querySelector("#root").style.filter = "none";
                  },
                }).then(() => {
                  navigate("/dashboard");
                });
              }
            }}
          >
            See Expenses
          </button>
        </div>
        <div className="button-wrapper">
          <button
            className="back-to-dashboard-btn"
            onClick={() =>
              navigate("/dashboard", { state: { resetToGettingStarted: true } })
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeBudgetPlanner;
