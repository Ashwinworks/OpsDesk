import React, { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onBackToHome: () => void;
  loading: boolean;
  error: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onBackToHome,
  loading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        {/* Back navigation */}
        <button onClick={onBackToHome} className="login-back-btn">
          <ArrowLeft size={14} />
          <span>Back to Overview</span>
        </button>

        {/* Header */}
        <div className="login-header-box">
          <div className="brand-logo" style={{ fontSize: '24px' }}>
            Ops<span>Desk</span>
          </div>
          <h2>Sign In to OpsDesk</h2>
          <p>Enter your corporate credentials to access your support workspace.</p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@opsdesk.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-orange"
            style={{ width: '100%', marginTop: '14px', padding: '13px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
