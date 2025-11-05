// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Link back to the landing page */}
        <Link to="/" className="logo-link">
          <h1 className="logo">SmartAIHub</h1>
        </Link>
        <nav className="nav-menu">
          {/* Note: Features link uses standard anchor to jump to the section on the landing page */}
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#about" className="nav-link">About Us</a>
          <a href="/#contact" className="nav-link">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;