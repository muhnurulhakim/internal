export type UserRole = 'karyawan' | 'supervisor' | 'manager';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  shift: 1 | 2 | 3;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  isLate: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  shift: number;
  editHistory: EditHistory[];
}

export interface EditHistory {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  reason?: string;
  approved?: boolean;
  approvedBy?: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
  editHistory: EditHistory[];
}