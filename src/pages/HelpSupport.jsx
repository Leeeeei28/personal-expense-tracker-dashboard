import {
  CircleHelp,
  Wallet,
  TrendingDown,
  PiggyBank,
  ChartPie,
  Mail,
} from "lucide-react";

import "./HelpSupport.css";

function HelpSupport() {
  const helpItems = [
    {
      icon: Wallet,
      title: "Income Management",
      description: "Add, edit, and delete your income records.",
    },
    {
      icon: TrendingDown,
      title: "Expense Management",
      description: "Track and manage your daily expenses.",
    },
    {
      icon: ChartPie,
      title: "Budget Management",
      description: "Monitor your spending against your budgets.",
    },
    {
      icon: PiggyBank,
      title: "Savings Goals",
      description: "Create savings goals and track your progress.",
    },
  ];

  return (
    <div className="help-page">
      <div className="help-heading">
        <h2>Help & Support</h2>
        <p>Find helpful information about using MyFinance.</p>
      </div>

      <div className="help-welcome">
        <CircleHelp size={35} />
        <div>
          <h3>How can we help you?</h3>
          <p>
            Learn how to use the different features of your
            personal expense tracker.
          </p>
        </div>
      </div>

      <div className="help-section">
        <h3>Frequently Asked Questions</h3>

        <div className="help-grid">
          {helpItems.map((item) => {
            const Icon = item.icon;

            return (
              <div className="help-card" key={item.title}>
                <Icon size={24} />
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="help-contact">
        <Mail size={24} />
        <div>
          <h3>Need more assistance?</h3>
          <p>
            Contact us if you need additional help.
          </p>
          <a href="mailto:support@myfinance.com">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
