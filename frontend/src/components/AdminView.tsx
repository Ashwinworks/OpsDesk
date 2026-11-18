import React, { useState } from 'react';
import { Ticket, User } from '../types';
import { TicketCard } from './TicketCard';
import { ShieldCheck, Clock, UserPlus } from 'lucide-react';

interface AdminViewProps {
  user: User;
  tickets: Ticket[];
  onUpdateStatus: (id: number, status: 'Open' | 'In Progress' | 'Resolved') => Promise<void>;
  onUpdatePriority: (id: number, priority: 'Low' | 'Medium' | 'High') => Promise<void>;
  onDeleteTicket: (id: number) => Promise<void>;
  onCreateUser: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'employee';
  }) => Promise<void>;
  loading: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  tickets,
  onUpdateStatus,
  onUpdatePriority,
  onDeleteTicket,
  onCreateUser,
  loading
}) => {
  const [filter, setFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [showUserModal, setShowUserModal] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState<string | null>(null);

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  const countOpen = tickets.filter((t) => t.status === 'Open').length;
  const countProgress = tickets.filter((t) => t.status === 'In Progress').length;
  const countResolved = tickets.filter((t) => t.status === 'Resolved').length;

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError(null);
    setUserSuccess(null);
    setCreatingUser(true);
    try {
      await onCreateUser({ name, email, password, role });
      setUserSuccess(`User "${name}" (${email}) created successfully!`);
      setName('');
      setEmail('');
      setPassword('');
      setRole('employee');
      setTimeout(() => {
        setShowUserModal(false);
        setUserSuccess(null);
      }, 1500);
    } catch (err: any) {
      setUserError(err.message || 'Failed to create user');
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Top Banner */}
      <div className="dashboard-banner">
        <div className="banner-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck size={26} style={{ color: 'var(--brand-orange)' }} />
            <h1>IT Operations Command</h1>
          </div>
          <p>
            Global service queue. Triage reported incidents, escalate priority tickets, and provision corporate user accounts.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <button
            onClick={() => setShowUserModal(true)}
            className="btn-orange btn-orange-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={16} />
            <span>+ Add New User</span>
          </button>

          {/* Counter Pills */}
          <div className="stats-pill-group">
            <span className="stat-pill total">
              Total: {tickets.length}
            </span>
            <span className="stat-pill open">
              Open: {countOpen}
            </span>
            <span className="stat-pill progress">
              Progress: {countProgress}
            </span>
            <span className="stat-pill resolved">
              Resolved: {countResolved}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab-btn ${filter === tab ? 'active' : ''}`}
          >
            {tab} {tab !== 'All' ? `(${tickets.filter((t) => t.status === tab).length})` : `(${tickets.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Clock size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-orange)', margin: '0 auto 8px' }} />
          <p>Syncing incident queue...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border-light)',
          borderRadius: '24px'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            No tickets found under "{filter}".
          </p>
        </div>
      ) : (
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              currentUser={user}
              onUpdateStatus={onUpdateStatus}
              onUpdatePriority={onUpdatePriority}
              onDelete={onDeleteTicket}
            />
          ))}
        </div>
      )}

      {/* Add New User Modal (Admin Only) */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} style={{ color: 'var(--brand-orange)' }} />
                <h3>Provision New Corporate User</h3>
              </div>
              <button onClick={() => setShowUserModal(false)} className="modal-close-btn">✕</button>
            </div>

            {userError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {userError}
              </div>
            )}

            {userSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {userSuccess}
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="alice@opsdesk.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
                  className="form-select"
                >
                  <option value="employee">Employee (Standard Support Reporter)</option>
                  <option value="admin">Administrator (IT Operations Staff)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="btn-outline-pill"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="btn-orange btn-orange-sm"
                >
                  {creatingUser ? 'Creating...' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
