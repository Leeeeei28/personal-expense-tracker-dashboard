import "./SummaryCard.css";

function SummaryCard({ title, amount, icon: Icon, color, description }) {
  return (
    <div className="summary-card">
      <div className="summary-card-top">
        <span className="summary-title">{title}</span>

        <div className="summary-icon" style={{ color }}>
          <Icon size={22} />
        </div>
      </div>

      <h2>{amount}</h2>

      <p>{description}</p>
    </div>
  );
}

export default SummaryCard;
