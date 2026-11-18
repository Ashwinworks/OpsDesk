import { useState, useEffect, useCallback } from 'react';
import { User, Ticket } from './types';
import { api } from './api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginView } from './components/LoginView';
import { EmployeeView } from './components/EmployeeView';
import { AdminView } from './components/AdminView';

export function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('opsdesk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'login'>(
    user ? 'landing' : 'landing'
  );

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch tickets according to role
  const loadTickets = useCallback(async (currentUser: User) => {
    try {
      setLoading(true);
      if (currentUser.role === 'admin') {
        const data = await api.getAllTickets();
        setTickets(data);
      } else {
        const data = await api.getMyTickets();
        setTickets(data);
      }
    } catch (err: any) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadTickets(user);
    }
  }, [user, loadTickets]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await api.login(email, pass);
      localStorage.setItem('opsdesk_token', res.token);
      localStorage.setItem('opsdesk_user', JSON.stringify(res.user));
      setUser(res.user);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('opsdesk_token');
    localStorage.removeItem('opsdesk_user');
    setUser(null);
    setTickets([]);
    setCurrentView('landing');
  };

  const handleCreateTicket = async (ticketData: {
    title: string;
    description: string;
    category: 'Hardware' | 'Software' | 'Network';
    priority: 'Low' | 'Medium' | 'High';
  }) => {
    await api.createTicket(ticketData);
    if (user) {
      await loadTickets(user);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: 'Open' | 'In Progress' | 'Resolved'
  ) => {
    await api.updateTicket(id, { status });
    if (user) {
      await loadTickets(user);
    }
  };

  const handleUpdatePriority = async (
    id: number,
    priority: 'Low' | 'Medium' | 'High'
  ) => {
    await api.updateTicket(id, { priority });
    if (user) {
      await loadTickets(user);
    }
  };

  const handleDeleteTicket = async (id: number) => {
    if (window.confirm(`Are you sure you want to delete Ticket #${id}?`)) {
      await api.deleteTicket(id);
      if (user) {
        await loadTickets(user);
      }
    }
  };

  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'employee';
  }) => {
    await api.createUser(userData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar
        user={user}
        currentView={currentView}
        onNavigate={(view) => {
          setAuthError(null);
          setCurrentView(view);
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {user ? (
          user.role === 'admin' ? (
            <AdminView
              user={user}
              tickets={tickets}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onDeleteTicket={handleDeleteTicket}
              onCreateUser={handleCreateUser}
              loading={loading}
            />
          ) : (
            <EmployeeView
              user={user}
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              loading={loading}
            />
          )
        ) : currentView === 'login' ? (
          <LoginView
            onLogin={handleLogin}
            onBackToHome={() => {
              setAuthError(null);
              setCurrentView('landing');
            }}
            loading={authLoading}
            error={authError}
          />
        ) : (
          <LandingPage onGetStarted={() => setCurrentView('login')} />
        )}
      </main>

      <footer className="w-full border-t border-slate-100 py-6 text-center text-xs text-slate-400 bg-white">
        <p>© 2026 OpsDesk – IT Incident Management System. Clean Modern Edition.</p>
      </footer>
    </div>
  );
}

export default App;
