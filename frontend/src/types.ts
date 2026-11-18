export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: 'Hardware' | 'Software' | 'Network';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  user_id?: number;
  created_by?: number;
  created_by_name?: string;
  created_by_email?: string;
  created_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
