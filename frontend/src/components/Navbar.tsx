import React from 'react';
import { User } from '../types';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  currentView: 'landing' | 'login' | 'dashboard';
  onNavigate: (view: 'landing' | 'login') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout
}) => {
  return (
    <header className="site-header">
      <div className="nav-container">
        {/* Brand Logo matching MySite */}
        <div 
          className="brand-logo"
          onClick={() => onNavigate('landing')}
        >
          Ops<span>Desk</span>
        </div>

        {/* Right Navigation */}
        <nav className="nav-links">
          {!user ? (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className={`nav-link ${currentView === 'landing' ? 'active-pill' : ''}`}
              >
                Home
              </button>
              <a 
                href="#features" 
                onClick={(e) => {
                  if (currentView !== 'landing') {
                    e.preventDefault();
                    onNavigate('landing');
                  }
                }}
                className="nav-link"
              >
                Services
              </a>
              <button
                onClick={() => onNavigate('login')}
                className={`nav-link ${currentView === 'login' ? 'active-pill' : ''}`}
              >
                Sign In
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="user-info-pill">
                <span className="user-dot"></span>
                <span>{user.name}</span>
                <span className="role-tag">{user.role}</span>
              </div>
              <button
                onClick={onLogout}
                className="btn-outline-pill"
                title="Sign Out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
