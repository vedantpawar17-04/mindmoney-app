import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./screens/LoginForm";
import Dashboard from "./screens/Dashboard";
import AddExpenses from "./screens/AddExpenses";
import SmartQuiz from "./screens/SmartQuiz";
import SignUpForm from "./screens/SignUpForm";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import IncomeBudgetPlanner from "./screens/IncomeBudgetPlanner";

function App() {
  // ✅ Global state (shared across routes)
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Default route -> SignUpForm */}
        <Route path="/" element={<SignUpForm />} />

        {/* Login route */}
        <Route path="/login" element={<LoginForm />} />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Reset Password */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard salary={salary} expenses={expenses} />}
        />

        {/* Add Expenses (updates salary & expenses) */}
        <Route
          path="/add-expenses"
          element={
            <AddExpenses
              salary={salary}
              setSalary={setSalary}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          }
        />

        {/* Smart Quiz */}
        <Route path="/smart-quiz" element={<SmartQuiz />} />

        {/* Income Budget Planner (uses existing salary & expenses) */}
        <Route
          path="/income-budget-planner"
          element={<IncomeBudgetPlanner salary={salary} expenses={expenses} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
