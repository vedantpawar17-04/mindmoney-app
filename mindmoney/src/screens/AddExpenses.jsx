import React, { useState} from "react"; // ⬅ useEffect added
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./AddExpenses.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddExpenses = ({ salary, setSalary, expenses, setExpenses }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "Not Selected",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  const categoryConfig = {
    Food: { color: "#F39F5A" },
    Travel: { color: "#DA0C81" },
    EMI: { color: "#4477CE" },
    Shopping: { color: "#EAB2A0" },
    Home: { color: "#116D6E" },
    Healthcare: { color: "#27374D" },
    Entertainment: { color: "#CD1818" },
    "Not Selected": { color: "#D21312" },
  };

  const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;

  const showAlert = (message, severity = "error") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!salary || salary <= 0) {
      showAlert("Please enter your total salary!");
      return;
    }

    if (!formData.category || formData.category === "Not Selected") {
      showAlert("Please select a category!");
      return;
    }

    if (expenses.some((exp) => exp.category === formData.category)) {
      showAlert(`${formData.category} already has an expense! Choose another category.`);
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      showAlert("Please enter a valid amount!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date,
    };

    setExpenses([...expenses, newExpense]);
    setFormData({ ...formData, amount: "", category: "Not Selected" });
    showAlert("Expense added successfully!", "success");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = salary - totalSpent > 0 ? salary - totalSpent : 0;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = [
    ...Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: categoryConfig[category]?.color || "#8884d8",
    })),
    { name: "Savings", value: savings, color: "#00C49F" },
  ];


  return (
    <div className="add-expenses-page">
      {/* MUI Snackbar Alert */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Left - Form */}
      <div className="add-expenses-form">
        <div className="card">
          <h2>💰 Salary & Add Expense</h2>

          <input
            type="number"
            className="form-input salary-input"
            placeholder="Enter Total Salary (₹)"
            value={salary || ""}
            onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
          />

          <form onSubmit={handleSubmit} noValidate>
            <select
              className="form-input category-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Not Selected">Not Selected</option>
              {Object.keys(categoryConfig)
                .filter((cat) => cat !== "Not Selected")
                .map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    disabled={expenses.some((exp) => exp.category === cat)} // 🚨 Disable used categories
                  >
                    {cat}
                  </option>
                ))}
            </select>

            <input
              type="number"
              className="form-input amount-input"
              placeholder="Enter amount (₹)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <button type="submit" className="big-gradient-btn">
              + Add Expense
            </button>

            <button
              type="button"
              className="big-gradient-btn red-btn"
              onClick={() => {
                if (!salary || salary <= 0) {
                  showAlert("Please enter your total salary before going back!");
                  return;
                }
                if (salary > 0 && expenses.length === 0) {
                  showAlert("Please enter at least one expense before going back!");
                  return;
                }
                navigate("/dashboard");
              }}
            >
              Back to Home
            </button>
          </form>

          {/* Recent Expenses */}
          <div className="recent-expenses">
            <h3>Recent Expenses</h3>
            <ul>
              {expenses.slice(-5).reverse().map((expense) => (
                <li key={expense.id}>
                  <span>
                    {expense.category} - {formatCurrency(expense.amount)}
                  </span>
                  <button onClick={() => deleteExpense(expense.id)}>×</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right - Chart & Stats */}
      <div className="add-expenses-stats">
        <div>
          <h2>📊 Spending Overview</h2>
          {pieChartData.length > 0 && (
            <div className="pie-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    dataKey="value"
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>

              <div className="legend">
                {pieChartData.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="category-breakdown">
            <h3>Category Wise Breakdown</h3>
            <div className="category-card">
              <div className="category-header">
                <span>Total Salary:</span>
                <span>{formatCurrency(salary)}</span>
              </div>
              <div className="category-header">
                <span>Total Spent:</span>
                <span>{formatCurrency(totalSpent)}</span>
              </div>
              <div className="category-header">
                <span>Savings:</span>
                <span>{formatCurrency(savings)}</span>
              </div>
            </div>

            {Object.entries(categoryTotals).map(([category, amount]) => {
              const percentage = salary > 0 ? ((amount / salary) * 100).toFixed(1) : 0;
              const color = categoryConfig[category]?.color || "#8884d8";

              return (
                <div key={category} className="category-card">
                  <div className="category-header">
                    <span>{category}:</span>
                    <span>
                      {formatCurrency(amount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenses;
