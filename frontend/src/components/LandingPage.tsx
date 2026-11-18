import React from 'react';
import { ArrowRight, Laptop, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section className="container-box">
        <div className="hero-wrapper">
          {/* Left Column: Headline and CTA */}
          <div className="hero-left">
            <h1 className="hero-headline">
              Report. Track. <br />
              <span className="orange-accent">Resolve.</span>
            </h1>

            <p className="hero-description">
              A simple and beautiful IT incident support desk built for modern workplaces.
            </p>

            <div>
              <button onClick={onGetStarted} className="btn-orange">
                Get Started
              </button>
            </div>
          </div>

          {/* Right Column: Visual illustration matching the clean reference aesthetic */}
          <div className="hero-right">
            <div className="visual-desk-card">
              {/* Top traffic light dots & badge */}
              <div className="visual-top-bar">
                <div className="traffic-dots">
                  <span className="traffic-dot red"></span>
                  <span className="traffic-dot yellow"></span>
                  <span className="traffic-dot green"></span>
                </div>
                <span className="badge-service-desk">
                  Live Service Desk
                </span>
              </div>

              {/* Clean Ticket Cards Preview */}
              <div className="preview-ticket-list">
                <div className="preview-ticket-item">
                  <div className="preview-ticket-left">
                    <div className="preview-icon-box green">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="preview-ticket-info">
                      <h4>Dual Monitor Display Glitch</h4>
                      <p>Hardware • Jane Doe</p>
                    </div>
                  </div>
                  <span className="pill-badge status-resolved">
                    Resolved
                  </span>
                </div>

                <div className="preview-ticket-item">
                  <div className="preview-ticket-left">
                    <div className="preview-icon-box blue">
                      <ShieldAlert size={18} />
                    </div>
                    <div className="preview-ticket-info">
                      <h4>VPN Access Permission Drop</h4>
                      <p>Network • High Priority</p>
                    </div>
                  </div>
                  <span className="pill-badge status-progress">
                    In Progress
                  </span>
                </div>

                <div className="preview-ticket-item">
                  <div className="preview-ticket-left">
                    <div className="preview-icon-box orange">
                      <Laptop size={18} />
                    </div>
                    <div className="preview-ticket-info">
                      <h4>IDE License Activation</h4>
                      <p>Software • Queued</p>
                    </div>
                  </div>
                  <span className="pill-badge status-open">
                    Open
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Strictly matching reference image layout) */}
      <section id="features" className="container-box features-section">
        <div className="section-header">
          <h2 className="section-title">Our Features</h2>
          <div className="orange-underline"></div>
        </div>

        {/* 3 Warm Peach Cards */}
        <div className="features-grid">
          <div className="feature-peach-card">
            <h3>Rapid Reporting</h3>
            <p>Simple steps to log incidents fast.</p>
          </div>

          <div className="feature-peach-card">
            <h3>Better Triage</h3>
            <p>Track your tickets step by step.</p>
          </div>

          <div className="feature-peach-card">
            <h3>Bright Future</h3>
            <p>Create a smooth, zero-downtime workplace.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button onClick={onGetStarted} className="btn-orange btn-orange-sm">
            <span>Enter OpsDesk Portal</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
};
