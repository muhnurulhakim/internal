import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Clock, Users, CheckCircle, Package } from 'lucide-react';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Selamat datang, {user?.name}</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-700">Shift {user?.shift}</p>
          <p className="text-xs text-blue-600">
            {user?.shift === 1 && '07:00 - 15:00'}
            {user?.shift === 2 && '15:00 - 23:00'}
            {user?.shift === 3 && '23:00 - 07:00'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kehadiran Hari Ini</p>
              <p className="text-xl font-semibold text-gray-800">85%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Karyawan</p>
              <p className="text-xl font-semibold text-gray-800">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tugas Selesai</p>
              <p className="text-xl font-semibold text-gray-800">92%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Item Stok</p>
              <p className="text-xl font-semibold text-gray-800">156</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Karyawan Terbaik</h2>
          <div className="space-y-4">
            {[
              { name: 'Budi Santoso', attendance: '98%', onTime: '100%' },
              { name: 'Siti Rahma', attendance: '96%', onTime: '98%' },
              { name: 'Ahmad Hidayat', attendance: '95%', onTime: '97%' },
            ].map((employee) => (
              <div key={employee.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{employee.name}</p>
                  <p className="text-sm text-gray-600">Kehadiran: {employee.attendance}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Tepat Waktu: {employee.onTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Stok Menipis</h2>
          <div className="space-y-4">
            {[
              { name: 'Handuk', quantity: 15, unit: 'pcs' },
              { name: 'Sabun', quantity: 20, unit: 'botol' },
              { name: 'Tissue', quantity: 10, unit: 'box' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    Stok Rendah
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}