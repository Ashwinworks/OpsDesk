import React, { useState } from 'react';
import { Ticket, User } from '../types';
import { TicketCard } from './TicketCard';
import { Plus, CheckCircle, Clock } from 'lucide-react';

interface EmployeeViewProps {
  user: User;
  tickets: Ticket[];
  onCreateTicket: (ticketData: {
    title: string;
    description: string;
    category: 'Hardware' | 'Software' | 'Network';
    priority: 'Low' | 'Medium' | 'High';
  }) => Promise<void>;
  loading: boolean;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({
  user,
  tickets,
  onCreateTicket,
  loading
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Hardware' | 'Software' | 'Network'>('Hardware');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateTicket({ title, description, category, priority });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setCategory('Hardware');
      setPriority('Medium');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Top Banner */}
      <div className="dashboard-banner">
        <div className="banner-text">
          <h1>Welcome back, {user.name}</h1>
          <p>
            Experiencing technical difficulties? Log an incident ticket and track its status from triage to resolution.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-orange">
          <Plus size={16} />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Tickets List */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>
          My Incident Reports ({tickets.length})
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Clock size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-orange)', margin: '0 auto 8px' }} />
          <p>Loading your tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border-light)',
          borderRadius: '24px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '9999px',
            backgroundColor: '#d1fae5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <CheckCircle size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>No open incidents</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            All your systems are operational. Click "Report Incident" if you require IT support.
          </p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} currentUser={user} />
          ))}
        </div>
      )}

      {/* Incident Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report an IT Incident</h3>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Workstation unable to resolve DNS on corporate Wi-Fi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide context, error messages, and troubleshooting attempted..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Network</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="Low">Low (Minor inconvenience)</option>
                    <option value="Medium">Medium (Single workflow)</option>
                    <option value="High">High (Completely blocked)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline-pill"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-orange btn-orange-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
