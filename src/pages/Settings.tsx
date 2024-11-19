import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, UserRole } from '../types';
import { encryptData, decryptData, hashPassword } from '../utils/encryption';
import { UserPlus, Key, Users } from 'lucide-react';

export default function SettingsPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('karyawan');
  const [shift, setShift] = useState<1 | 2 | 3>(1);
  
  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(decryptData(storedUsers));
    }
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cek apakah currentUser ada dan memiliki role 'manager'
    if (!currentUser || currentUser.role !== 'manager') {
      setError('Hanya manager yang dapat menambahkan user baru');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password: hashPassword(password),
      name,
      role,
      shift,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', encryptData(updatedUsers));
    setUsers(updatedUsers);
    setShowAddUser(false);
    resetForm();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Pengguna tidak ditemukan');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password baru tidak cocok');
      return;
    }

    const updatedUsers = users.map((user) => {
      if (user.id === currentUser.id) {
        if (user.password !== hashPassword(currentPassword)) {
          setError('Password saat ini salah');
          return user;
        }
        return { ...user, password: hashPassword(newPassword) };
      }
      return user;
    });

    localStorage.setItem('users', encryptData(updatedUsers));
    setUsers(updatedUsers);
    setShowChangePassword(false);
    resetPasswordForm();
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setRole('karyawan');
    setShift(1);
    setError('');
  };

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Profil Pengguna</h2>
              <p className="text-gray-600">Informasi akun Anda</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Nama</p>
              <p className="font-medium text-gray-800">{currentUser?.name || 'Tidak tersedia'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium text-gray-800">{currentUser?.username || 'Tidak tersedia'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium text-gray-800 capitalize">{currentUser?.role || 'Tidak tersedia'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Shift</p>
              <p className="font-medium text-gray-800">Shift {currentUser?.shift || 'Tidak tersedia'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Aksi Cepat</h2>
          <div className="space-y-4">
            {currentUser?.role === 'manager' && (
              <button
                onClick={() => setShowAddUser(true)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-800">Tambah User Baru</span>
                </div>
              </button>
            )}
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <Key className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">Ganti Password</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah User Baru</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Form fields for adding user */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="karyawan">Karyawan</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>Shift 1</option>
                  <option value={2}>Shift 2</option>
                  <option value={3}>Shift 3</option>
                </select>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Tambah User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ganti Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Ganti Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
