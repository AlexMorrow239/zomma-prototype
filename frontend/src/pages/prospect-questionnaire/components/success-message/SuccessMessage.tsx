import "./SuccessMessage.scss";

export default function SuccessMessage() {
  const letters = "ZOMMA".split("");

  return (
    <div className="success-message-container">
      <div className="success-card">
        <div className="card-header">
          <div className="logo-container">
            {letters.map((letter, index) => (
              <span
                key={index}
                className="logo-letter"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          <h2>Thank You!</h2>
        </div>
        <div className="card-content">
          <p>
            Your questionnaire has been submitted successfully. A ZOMMA
            representative will contact you shortly.
          </p>
        </div>
        <div className="card-footer">
          <button
            className="return-button"
            onClick={() => window.location.reload()}
          >
            Submit Another Request
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
