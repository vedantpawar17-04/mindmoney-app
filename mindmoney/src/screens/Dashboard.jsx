// Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, DollarSign, Brain, User } from "lucide-react";
import "./Dashboard.css";
import Footer from "./Footer";
import "./Footer.css";

const Dashboard = ({ userName = "User" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // go back to login or home
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-flex">
            <h1 className="dashboard-title">MindMoney</h1>
            <div className="dashboard-user">
              <User size={16} />
              <span className="user-text">Welcome, {userName}</span>
            </div>
          </div>

          <div className="logout-button">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* ✅ Always show Getting Started */}
        <div className="getting-started">
          <h3>🚀 Get Started in 3 Simple Steps</h3>
          <p>Your financial wellness journey begins here</p>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-title">Track Expenses</div>
              <div className="step-description">
                Log your daily expenses such as coffee, meals, transport,
                and any other daily purchases.
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-title">Income Budget Planner</div>
              <div className="step-description">
                Transform your monthly income into a stress-free budget plan.
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-title">Watch Magic Happen</div>
              <div className="step-description">
                Track your spending, understand where your money goes, and
                start saving more effectively!
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Actions */}
        <div className="actions-grid">
          <button
            onClick={() => navigate("/add-expenses")}
            className="action-button"
          >
            <PlusCircle size={48} className="action-icon green" />
            <h3 className="action-title">Add Expense</h3>
            <p className="action-subtext">Turn everyday spending into smarter savings.</p>
          </button>

          <button className="action-button" onClick={() => navigate("/income-budget-planner")}>
            <DollarSign size={48} className="action-icon blue" />
            <h3 className="action-title">Income Budget Planner</h3>
            <p className="action-subtext">Earn, Plan, Save, Succeed.</p>
          </button>

          <button
            className="action-button"
            onClick={() => navigate("/smart-quiz")}
          >
            <Brain size={48} className="action-icon purple" />
            <h3 className="action-title">Stress Check</h3>
            <p className="action-subtext">Measure and improve your money well-being.</p>
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
