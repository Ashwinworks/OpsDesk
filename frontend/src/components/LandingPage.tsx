import React from 'react';
import { ArrowRight, Laptop, CheckCircle2, ShieldAlert, Zap, SlidersHorizontal, ShieldCheck, Activity } from 'lucide-react';

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
            {/* Pill Badge */}
            <div className="hero-pill-badge">
              <span className="pulse-beacon"></span>
              <span className="font-semibold text-xs tracking-wide">Enterprise IT Operations Platform</span>
            </div>

            <h1 className="hero-headline">
              Report. Track. <br />
              <span className="orange-accent">Resolve.</span>
            </h1>

            <p className="hero-description">
              A modern, high-velocity IT service desk designed to eliminate downtime and keep workplace systems running at peak performance.
            </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button onClick={onGetStarted} className="btn-orange">
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </button>
                <a href="#features" className="btn-outline-pill" style={{ padding: '12px 22px', fontSize: '15px' }}>
                  Explore Features
                </a>
              </div>

              {/* Metrics & Trust Stats */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <div className="stat-value">&lt; 15m</div>
                  <div className="stat-label">Avg. Response Time</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-item">
                  <div className="stat-value">99.9%</div>
                  <div className="stat-label">Service Continuity</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-item">
                  <div className="stat-value">Zero</div>
                  <div className="stat-label">Lost Inquiries</div>
                </div>
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
                    <span className="badge-service-desk" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Activity size={12} className="text-[#ff6a00]" />
                      <span>Real-time Triage</span>
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

      {/* Features Section */}
      <section id="features" className="container-box features-section">
        <div className="section-header">
          <h2 className="section-title">Our Features</h2>
          <div className="orange-underline"></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '14px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            Everything your engineering and operations teams need to manage technical incidents from intake to signoff.
          </p>
        </div>

        {/* 3 Warm Peach Cards */}
        <div className="features-grid">
          <div className="feature-peach-card">
            <div className="feature-icon-bubble">
              <Zap size={22} color="#ff6a00" />
            </div>
            <h3>Rapid Reporting</h3>
            <p>Employees log standardized issues in seconds with smart categorization and priority tagging.</p>
          </div>

          <div className="feature-peach-card">
            <div className="feature-icon-bubble">
              <SlidersHorizontal size={22} color="#ff6a00" />
            </div>
            <h3>Better Triage</h3>
            <p>Admin command center provides instant visibility across all active hardware and network outages.</p>
          </div>

          <div className="feature-peach-card">
            <div className="feature-icon-bubble">
              <ShieldCheck size={22} color="#ff6a00" />
            </div>
            <h3>Bright Future</h3>
            <p>Eliminate back-and-forth emails with live ticket status transparency and guaranteed SLA tracking.</p>
          </div>
        </div>

            <div style={{ textAlign: 'center', marginTop: '54px' }}>
              <button onClick={onGetStarted} className="btn-orange">
                <span>Enter OpsDesk Portal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>
        );
};
