import React from 'react';
import './App.css'; // Import shared CSS

// Data for the feature cards
const featureData = [
  {
    icon: '✉️',
    title: 'Spam Detection',
    description: 'Leverages Naive Bayes and NLP to classify incoming emails and messages as Spam or Ham, securing user inboxes from phishing and clutter.',
  },
  {
    icon: '📊',
    title: 'WhatsApp Chat Analysis',
    description: 'Processes exported chat logs to perform Sentiment Analysis, visualize user activity, and reveal key conversation patterns and topics.',
  },
  {
    icon: '🏠',
    title: 'House Price Prediction',
    description: 'Uses Ensemble Regression (like Random Forest) on tabular real estate data to provide accurate and reliable property valuation forecasts.',
  },
];

// Sub-component for a single feature card
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <h2>Core Machine Learning Features</h2>
      <div className="features-grid">
        {featureData.map((feature) => (
          <FeatureCard 
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;