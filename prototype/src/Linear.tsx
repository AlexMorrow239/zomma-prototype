import React, { useState } from "react";
import { CheckSquare } from "lucide-react";
import "./Linear.scss";

const ClientQuestionnaireLinear = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    preferredContact: "",
    email: "",
    phone: "",
    financialGoals: "",
    challenges: "",
    selectedServices: new Set<string>(),
    budgetRange: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const services = [
    {
      id: "tax",
      name: "Tax Compliance",
      description: "Tax preparation and planning services",
    },
    {
      id: "estate",
      name: "Estate Planning",
      description: "Comprehensive estate planning solutions",
    },
    {
      id: "business",
      name: "Business Consulting",
      description: "Strategic business advice and planning",
    },
    {
      id: "audit",
      name: "Audit Services",
      description: "Financial audit and assurance services",
    },
    {
      id: "financial",
      name: "Financial Planning",
      description: "Personal and business financial planning",
    },
    {
      id: "bookkeeping",
      name: "Bookkeeping",
      description: "Regular bookkeeping and accounting services",
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitSuccess(true);
  };

  const toggleService = (serviceId: string) => {
    const newServices = new Set(formData.selectedServices);
    if (newServices.has(serviceId)) {
      newServices.delete(serviceId);
    } else {
      newServices.add(serviceId);
    }
    setFormData({ ...formData, selectedServices: newServices });
  };

  if (submitSuccess) {
    return (
      <div className="questionnaire-linear">
        <div className="success-message">
          <h2>Thank You!</h2>
          <p>
            Your questionnaire has been submitted successfully. A ZOMMA
            representative will contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-linear">
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <h1>ZOMMA Group Prospective Client Questionnaire</h1>

          {/* Contact Information Section */}
          <div className="section">
            <h2>Contact Information</h2>
            <div className="grid-container">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessName">
                  Business Name (if applicable)
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferredContact">
                  Preferred Contact Method
                </label>
                <select
                  id="preferredContact"
                  value={formData.preferredContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContact: e.target.value,
                    })
                  }
                >
                  <option value="">Select preferred contact method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text Message</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Goals Section */}
          <div className="section">
            <h2>Financial Goals</h2>
            <div className="form-group">
              <label htmlFor="financialGoals">
                What are your primary financial objectives for the next 1-3
                years?
              </label>
              <textarea
                id="financialGoals"
                value={formData.financialGoals}
                onChange={(e) =>
                  setFormData({ ...formData, financialGoals: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="challenges">
                What financial challenges are you currently facing?
              </label>
              <textarea
                id="challenges"
                value={formData.challenges}
                onChange={(e) =>
                  setFormData({ ...formData, challenges: e.target.value })
                }
              />
            </div>
          </div>

          {/* Services Section */}
          <div className="section">
            <h2>Services of Interest</h2>
            <p className="section-description">
              Select the services you're interested in learning more about:
            </p>
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-item ${
                    formData.selectedServices.has(service.id) ? "selected" : ""
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="service-content">
                    <CheckSquare
                      className={
                        formData.selectedServices.has(service.id)
                          ? "selected"
                          : ""
                      }
                    />
                    <div className="service-info">
                      <span className="service-name">{service.name}</span>
                      <span className="service-description">
                        {service.description}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Section */}
          <div className="section">
            <h2>Budget Information</h2>
            <div className="form-group">
              <label htmlFor="budgetRange">
                Expected Budget Range (Optional)
              </label>
              <select
                id="budgetRange"
                value={formData.budgetRange}
                onChange={(e) =>
                  setFormData({ ...formData, budgetRange: e.target.value })
                }
              >
                <option value="">Select budget range</option>
                <option value="below5k">Below $5,000</option>
                <option value="5k-10k">$5,000 - $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="above50k">Above $50,000</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="submit-button">
            Submit Questionnaire
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientQuestionnaireLinear;
