// src/components/MainSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function MainSection() {
  return (
    <main className="main-section">
      
      {/* 🚀 Hero Section: Introduction to the Hub */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Your Unified Platform for Practical Machine Learning</h2>
          <p>
            **SmartAIHub** brings together essential AI tools for **security**, **insight**, 
            and informed **decision-making**, all in one intuitive interface.
          </p>
          {/* CTA button links to the features section */}
          <a href="#features" className="cta-button">Explore Features</a>
        </div>
      </section>

      {/* 🧩 Features Section: The Three Pillars */}
      <section id="features" className="features-section">
        <h3>Core AI Capabilities</h3>
        <div className="feature-cards">
          
          {/* Card 1: Spam Detection */}
          <Link to="/spam-detection" className="card-link">
            <div className="card feature-card-spam">
              <h4>🛡️ Email & Message Spam Detection</h4>
              <p>Leverage Natural Language Processing (NLP) to accurately identify and filter unwanted spam, enhancing your digital security and productivity.</p>
              <button className="card-button">Analyze Text</button>
            </div>
          </Link>

          {/* Card 2: WhatsApp Chat Analysis */}
          <Link to="/whatsapp-analysis" className="card-link">
            <div className="card feature-card-whatsapp">
              <h4>💬 WhatsApp Chat Analysis</h4>
              <p>Gain valuable insights into your communication patterns, message frequency, and top contacts with interactive data visualizations and metrics.</p>
              <button className="card-button">Analyze Chat</button>
            </div>
          </Link>
          
          {/* Card 3: House Price Prediction */}
          <Link to="/house-price-prediction" className="card-link">
            <div className="card feature-card-house">
              <h4>🏠 House Price Prediction</h4>
              <p>Receive accurate, data-driven valuations for residential properties. Make smarter real estate decisions based on powerful regression models.</p>
              <button className="card-button">Estimate Price</button>
            </div>
          </Link>

        </div>
      </section>
      
      {/* 💡 Info Section: Value Proposition */}
      <section id="about" className="info-section">
        <h3>Why SmartAIHub?</h3>
        <p>We believe in making powerful machine learning accessible. Our platform simplifies complex algorithms into easy-to-use tools that deliver real-world value across various domains.</p>
      </section>
      
    </main>
  );
}

export default MainSection;