import { AuthResponse, Ticket, User } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('opsdesk_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    return data;
  },

  async getMyTickets(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE_URL}/tickets/my`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch personal tickets');
    }
    return data;
  },

  async getAllTickets(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch tickets');
    }
    return data;
  },

  async createTicket(ticketData: {
    title: string;
    description: string;
    category: 'Hardware' | 'Software' | 'Network';
    priority: 'Low' | 'Medium' | 'High';
  }): Promise<Ticket> {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ticketData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create ticket');
    }
    return data;
  },

  async updateTicket(id: number, updates: {
    status?: 'Open' | 'In Progress' | 'Resolved';
    priority?: 'Low' | 'Medium' | 'High';
    title?: string;
    description?: string;
  }): Promise<Ticket> {
    const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update ticket');
    }
    return data;
  },

  async deleteTicket(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete ticket');
    }
  },

  async getAllUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch users');
    }
    return data;
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'employee';
  }): Promise<{ message: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create user');
    }
    return data;
  }
};
