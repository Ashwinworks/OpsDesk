import React from 'react';
import { Ticket, User } from '../types';
import { Laptop, Package, Wifi, Folder, Trash2, Calendar, User as UserIcon } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  currentUser: User;
  onUpdateStatus?: (id: number, status: 'Open' | 'In Progress' | 'Resolved') => void;
  onUpdatePriority?: (id: number, priority: 'Low' | 'Medium' | 'High') => void;
  onDelete?: (id: number) => void;
}

const renderCategoryIcon = (category: string) => {
  switch (category) {
    case 'Hardware':
      return <Laptop size={14} style={{ color: '#ff6a00', marginRight: '4px' }} />;
    case 'Software':
      return <Package size={14} style={{ color: '#2563eb', marginRight: '4px' }} />;
    case 'Network':
      return <Wifi size={14} style={{ color: '#7c3aed', marginRight: '4px' }} />;
    default:
      return <Folder size={14} style={{ color: '#64748b', marginRight: '4px' }} />;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'status-open';
    case 'In Progress':
      return 'status-progress';
    case 'Resolved':
      return 'status-resolved';
    default:
      return '';
  }
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'priority-high';
    case 'Medium':
      return 'priority-medium';
    case 'Low':
      return 'priority-low';
    default:
      return '';
  }
};

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  currentUser,
  onUpdateStatus,
  onUpdatePriority,
  onDelete
}) => {
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="ticket-card">
      <div>
        {/* Top Header: ID & Pills */}
        <div className="ticket-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="ticket-id">#{ticket.id}</span>
            <span className="pill-badge" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', display: 'flex', alignItems: 'center' }}>
              {renderCategoryIcon(ticket.category)}
              {ticket.category}
            </span>
          </div>

          <div className="ticket-pills">
            <span className={`pill-badge ${getPriorityClass(ticket.priority)}`}>
              {ticket.priority}
            </span>
            <span className={`pill-badge ${getStatusClass(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="ticket-title">{ticket.title}</h3>
        <p className="ticket-desc">{ticket.description}</p>
      </div>

      {/* Footer Info & Admin Actions */}
      <div>
        <div className="ticket-meta-footer">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserIcon size={12} />
            {ticket.created_by_name || `User #${ticket.user_id || ticket.created_by || 'Unknown'}`}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            {new Date(ticket.created_date || ticket.created_at || Date.now()).toLocaleDateString()}
          </span>
        </div>

        {isAdmin && (
          <div className="admin-action-row">
            <select
              value={ticket.status}
              onChange={(e) => onUpdateStatus?.(ticket.id, e.target.value as any)}
              className="form-select"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <option value="Open">Status: Open</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Resolved">Status: Resolved</option>
            </select>

            <select
              value={ticket.priority}
              onChange={(e) => onUpdatePriority?.(ticket.id, e.target.value as any)}
              className="form-select"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <option value="Low">Priority: Low</option>
              <option value="Medium">Priority: Medium</option>
              <option value="High">Priority: High</option>
            </select>

            <button
              onClick={() => onDelete?.(ticket.id)}
              className="btn-outline-pill"
              style={{ marginLeft: 'auto', padding: '6px 10px', color: '#dc2626', borderColor: '#fecaca' }}
              title="Delete Incident"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
