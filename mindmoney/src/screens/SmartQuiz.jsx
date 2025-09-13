// SmartQuiz.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaRedoAlt,
  FaChartBar,
  FaHome,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import "./SmartQuiz.css";

export default function SmartQuiz() {
  const navigate = useNavigate();

  // ✅ Back to Dashboard → Reset to Getting Started
  const goHome = () => {
    navigate("/dashboard", { state: { resetToGettingStarted: true } });
  };
  

  const questions = useMemo(
    () => [
      {
        category: "Income vs Expenses",
        text: "How often do you struggle to pay all your monthly bills on time?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        category: "Emergency Fund",
        text: "If you had an unexpected expense of $500, how would you handle it?",
        options: [
          "Easily cover with savings",
          "Cover with small adjustments",
          "Use partial savings/credit",
          "Mostly credit/loan",
          "Impossible without major stress",
        ],
      },
      {
        category: "Monthly Budget",
        text: "How much of your income goes to fixed monthly expenses?",
        options: [
          "Less than 20%",
          "20–40%",
          "40–60%",
          "60–80%",
          "More than 80%",
        ],
      },
      {
        category: "Credit & Debt",
        text: "How much stress do your monthly debt payments cause you?",
        options: [
          "None at all",
          "Very little",
          "Some",
          "Quite a lot",
          "Extreme stress",
        ],
      },
      {
        category: "Food & Groceries",
        text: "How often do you worry about affording groceries and food?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        category: "Transportation",
        text: "How stressful are your monthly transportation costs?",
        options: [
          "Not stressful",
          "Slightly stressful",
          "Moderately stressful",
          "Very stressful",
          "Extremely stressful",
        ],
      },
      {
        category: "Healthcare",
        text: "How do healthcare and medical expenses affect your monthly budget?",
        options: ["No impact", "Minimal impact", "Some impact", "Large impact", "Severe impact"],
      },
      {
        category: "Savings & Future",
        text: "How much are you able to save each month?",
        options: ["A lot", "Some", "A little", "Almost nothing", "None at all"],
      },
      {
        category: "Sleep & Mental Health",
        text: "How often do money worries keep you awake at night?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        category: "Overall Control",
        text: "How in control do you feel about your monthly financial situation?",
        options: [
          "Completely in control",
          "Mostly in control",
          "Somewhat in control",
          "Rarely in control",
          "Not at all in control",
        ],
      },
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const progress = Math.round(((current + 1) / questions.length) * 100);

  const handleSelect = (index) => {
    const value = index + 1;
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
  };

  const nextQ = () => current < questions.length - 1 && setCurrent((c) => c + 1);
  const prevQ = () => current > 0 && setCurrent((c) => c - 1);

  const submit = () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const total = useMemo(
    () => answers.reduce((sum, v) => sum + (v || 0), 0),
    [answers]
  );
  const avg = useMemo(() => total / questions.length, [total, questions.length]);

  const levelInfo = useMemo(() => {
    if (avg <= 1.5)
      return {
        name: "Very Low Stress",
        tone: "success",
        message:
          "Excellent financial health! Keep doing what you’re doing and consider optimizing savings/investments.",
        tips: [
          "Maintain your emergency fund (3–6 months).",
          "Automate savings and investments.",
          "Review insurance and subscriptions annually.",
          "Set new financial goals to stay motivated.",
        ],
      };
    if (avg <= 2.5)
      return {
        name: "Low Stress",
        tone: "info",
        message:
          "You’re managing well with minor concerns. Keep building good habits and fine-tune your budget.",
        tips: [
          "Increase your savings rate gradually.",
          "Track small leaks (fees, unused subscriptions).",
          "Plan for upcoming large expenses.",
          "Rebalance spending categories quarterly.",
        ],
      };
    if (avg <= 3.5)
      return {
        name: "Moderate Stress",
        tone: "warn",
        message:
          "You’re feeling some pressure. There’s room to improve budgeting and reduce avoidable costs.",
        tips: [
          "Create a zero-based budget and track weekly.",
          "Cut 1–2 non-essential categories for 60 days.",
          "Snowball or avalanche high-interest debts.",
          "Build an emergency fund—even small steps count.",
        ],
      };
    if (avg <= 4.5)
      return {
        name: "High Stress",
        tone: "danger",
        message:
          "Significant stress detected. Take action to reduce expenses and explore ways to increase income.",
        tips: [
          "List and pause non-essential spending immediately.",
          "Call providers to negotiate bills and rates.",
          "Consider temporary extra income (freelance/part-time).",
          "Prioritize high-interest debt repayment.",
        ],
      };
    return {
      name: "Very High Stress",
      tone: "critical",
      message:
        "Severe financial stress. Seek professional counseling and support resources as soon as possible.",
      tips: [
        "Contact a nonprofit credit counselor for a plan.",
        "Ask creditors about hardship options.",
        "Check local assistance (food, utilities, housing).",
        "Focus on essentials first: food, shelter, utilities.",
      ],
    };
  }, [avg]);

  if (submitted) {
    return (
      <div className="sq-results">
        <header className="sq-header">
          <FaChartBar className="sq-hero-icon" />
          <h1 className="sq-title">Your Financial Stress Results</h1>
        </header>

        <section className={`sq-level sq-${levelInfo.tone}`}>
          <div className="sq-level-head">
            <FaCheckCircle />
            <h2>{levelInfo.name}</h2>
          </div>
          <p>{levelInfo.message}</p>
        </section>

        <section className="sq-card">
          <div className="sq-card-head">
            <h3>Score Breakdown by Question</h3>
            <span className="sq-legend">
              <span className="sq-pill pill-low">1–2</span>
              <span className="sq-pill pill-mid">3–4</span>
              <span className="sq-pill pill-high">5</span>
            </span>
          </div>
          <ul className="sq-bars">
            {answers.map((val, i) => {
              const width = `${(val / 5) * 100}%`;
              const toneClass =
                val <= 2 ? "bar-low" : val <= 4 ? "bar-mid" : "bar-high";
              return (
                <li key={i} className="sq-bar-row">
                  <div className="sq-bar-label">Q{i + 1}</div>
                  <div className="sq-bar-track">
                    <div
                      className={`sq-bar-fill ${toneClass}`}
                      style={{ width }}
                    />
                  </div>
                  <div className="sq-bar-value">{val}/5</div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="sq-card">
          <div className="sq-card-head">
            <h3>Recommended Actions</h3>
          </div>
          <ul className="sq-tips">
            {levelInfo.tips.map((t, idx) => (
              <li key={idx}>
                <FaInfoCircle /> {t}
              </li>
            ))}
          </ul>
        </section>

        {avg > 3.5 && (
          <section className="sq-alert">
            <strong>Need support?</strong> Consider contacting a nonprofit
            credit counseling service in your region for guidance.
          </section>
        )}

        <div className="sq-actions">
          <button className="sq-btn sq-secondary" onClick={() => window.location.reload()}>
            <FaRedoAlt /> Take Quiz Again
          </button>
          <button className="sq-btn" onClick={goHome}>
            <FaHome /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const selected = answers[current];

  return (
    <div className="sq-container">
      <div className="sq-progress-wrap">
        <div className="sq-progress" style={{ width: `${progress}%` }} />
      </div>
      <div className="sq-progress-meta">
        <span>
          Question {current + 1} of {questions.length}
        </span>
        <span>{progress}% complete</span>
      </div>

      <div className="sq-card">
        <div className="sq-card-head">
          <div className="sq-category">{q.category}</div>
          <h1 className="sq-question">{q.text}</h1>
        </div>

        <div className="sq-options">
          {q.options.map((opt, idx) => {
            const isSelected = selected === idx + 1;
            return (
              <button
                key={idx}
                className={`sq-option ${isSelected ? "is-selected" : ""}`}
                onClick={() => handleSelect(idx)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="sq-nav">
          <button
            className="sq-btn sq-secondary"
            onClick={prevQ}
            disabled={current === 0}
          >
            <FaArrowLeft /> Back
          </button>

          {current < questions.length - 1 ? (
            <button
              className="sq-btn"
              onClick={nextQ}
              disabled={answers[current] === null}
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              className="sq-btn"
              onClick={submit}
              disabled={answers[current] === null}
            >
              Submit <FaChartBar />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
