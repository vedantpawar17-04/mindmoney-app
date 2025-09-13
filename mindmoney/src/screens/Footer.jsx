import React, { useEffect } from "react";
import "./Footer.css";

const Footer = () => {
  useEffect(() => {
    // Intersection Observer animations
    const faqItems = document.querySelectorAll(".faq-item");

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    faqItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition = `all 0.6s ease ${index * 0.1}s`;
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleFAQ = (e) => {
    const element = e.currentTarget;
    const faqItem = element.parentElement;
    const answer = element.nextElementSibling;

    // Close all other FAQ items
    const allFaqItems = document.querySelectorAll(".faq-item");
    allFaqItems.forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("active");
        item.querySelector(".faq-answer").classList.remove("active");
      }
    });

    // Toggle current FAQ item
    faqItem.classList.toggle("active");
    answer.classList.toggle("active");

    if (answer.classList.contains("active")) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 150);
    }
  };

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>
          Get quick answers to common questions about managing your finances and
          tracking your financial wellness
        </p>
      </div>

      <div className="faq-container">
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <h3>How do I add expenses to track my spending?</h3>
            <div className="faq-icon">+</div>
          </div>
          <div className="faq-answer">
            <p>
              Simply click the "Add Expense" button, enter the amount, select a
              category (like food, transport, or entertainment), and add a brief
              description. Your expenses are automatically saved and categorized
              to help you understand your spending patterns over time.
            </p>
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <h3>How does the Stress Check feature work?</h3>
            <div className="faq-icon">+</div>
          </div>
          <div className="faq-answer">
            <p>
              The Stress Check analyzes your financial data to identify
              potential stress indicators like overspending, low savings, or
              irregular income. It provides personalized insights and
              recommendations to help improve your financial wellness and reduce
              money-related anxiety.
            </p>
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <h3>What's the workflow of using this website?</h3>
            <div className="faq-icon">+</div>
          </div>
          <div className="faq-answer">
            <p>
              Start by adding your income sources, then record daily expenses as
              they occur. Use the Stress Check feature weekly to monitor your
              financial health. The app will generate insights, budgeting tips,
              and alerts to help you maintain healthy financial habits and
              achieve your goals.
            </p>
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <h3>Can I track multiple income sources?</h3>
            <div className="faq-icon">+</div>
          </div>
          <div className="faq-answer">
            <p>
              Yes! The "Add Income" feature allows you to record your salary,
              freelance work, investments, side hustles, and any other income
              sources. This gives you a complete picture of your financial
              inflow and helps with accurate budgeting and financial planning.
            </p>
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <h3>Is my financial data secure and private?</h3>
            <div className="faq-icon">+</div>
          </div>
          <div className="faq-answer">
            <p>
              Absolutely. We use bank-level encryption to protect your data, and
              all information is stored securely with regular backups. Your
              financial information is never shared with third parties, and you
              have complete control over your data with options to export or
              delete it anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="faq-footer">
        <p>Still have questions? We're here to help!</p>
        <a href="#contact" className="contact-button">
          <span role="img" aria-label="email">
            📧
          </span>
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default Footer;
