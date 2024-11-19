import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Hotel,
  LayoutDashboard,
  Clock,
  ClipboardCheck,
  Package,
  Settings,
  LogOut,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Hotel className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="font-bold text-gray-800">Hotel Laa Royba</h1>
              <p className="text-sm text-gray-600">HRIS System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <a href="/" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="/attendance" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700">
            <Clock className="w-5 h-5" />
            <span>Absensi</span>
          </a>
          <a href="/tasks" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700">
            <ClipboardCheck className="w-5 h-5" />
            <span>Tugas</span>
          </a>
          {(user?.role === 'supervisor' || user?.role === 'manager') && (
            <a href="/inventory" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700">
              <Package className="w-5 h-5" />
              <span>Stok</span>
            </a>
          )}
          <a href="/settings" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700">
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </a>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}