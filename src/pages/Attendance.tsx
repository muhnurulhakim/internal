import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { Clock, CheckCircle } from 'lucide-react';
import { Attendance } from '../types';
import { encryptData, decryptData } from '../utils/encryption';

export default function AttendancePage() {
  const user = useAuthStore((state) => state.user);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);

  useEffect(() => {
    const storedAttendances = localStorage.getItem('attendances');
    if (storedAttendances) {
      const decryptedAttendances = decryptData(storedAttendances);
      setAttendances(decryptedAttendances);
      const today = format(new Date(), 'yyyy-MM-dd');
      const userTodayAttendance = decryptedAttendances.find(
        (a) => a.userId === user?.id && a.date === today
      );
      setTodayAttendance(userTodayAttendance || null);
    }
  }, [user]);

  const handleCheckIn = () => {
    const now = new Date();
    const shiftStartTime = user?.shift === 1 ? '07:00' :
                          user?.shift === 2 ? '15:00' : '23:00';
    const isLate = format(now, 'HH:mm') > shiftStartTime;

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      userId: user?.id!,
      date: format(now, 'yyyy-MM-dd'),
      checkIn: format(now, 'HH:mm:ss'),
      checkOut: null,
      isLate
    };

    const updatedAttendances = [...attendances, newAttendance];
    localStorage.setItem('attendances', encryptData(updatedAttendances));
    setAttendances(updatedAttendances);
    setTodayAttendance(newAttendance);
  };

  const handleCheckOut = () => {
    if (!todayAttendance) return;

    const now = new Date();
    const updatedAttendance = {
      ...todayAttendance,
      checkOut: format(now, 'HH:mm:ss')
    };

    const updatedAttendances = attendances.map(a =>
      a.id === todayAttendance.id ? updatedAttendance : a
    );

    localStorage.setItem('attendances', encryptData(updatedAttendances));
    setAttendances(updatedAttendances);
    setTodayAttendance(updatedAttendance);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Absensi</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Status Kehadiran Hari Ini</h2>
            <p className="text-gray-600">
              {format(new Date(), 'EEEE, dd MMMM yyyy')}
            </p>
          </div>
          <div className="flex space-x-4">
            {!todayAttendance ? (
              <button
                onClick={handleCheckIn}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Clock className="w-5 h-5" />
                <span>Check In</span>
              </button>
            ) : !todayAttendance.checkOut ? (
              <button
                onClick={handleCheckOut}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Check Out</span>
              </button>
            ) : (
              <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                Shift Selesai
              </span>
            )}
          </div>
        </div>

        {todayAttendance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Check In</p>
              <p className="text-lg font-semibold text-gray-800">
                {todayAttendance.checkIn}
              </p>
              {todayAttendance.isLate && (
                <span className="text-xs text-red-600">Terlambat</span>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Check Out</p>
              <p className="text-lg font-semibold text-gray-800">
                {todayAttendance.checkOut || '-'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-gray-800">
                {todayAttendance.checkOut ? 'Selesai' : 'Sedang Bertugas'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Absensi</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Check In</th>
                <th className="px-4 py-2 text-left">Check Out</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendances
                .filter((a) => a.userId === user?.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((attendance) => (
                  <tr key={attendance.id} className="border-t">
                    <td className="px-4 py-2">{attendance.date}</td>
                    <td className="px-4 py-2">
                      {attendance.checkIn}
                      {attendance.isLate && (
                        <span className="ml-2 text-xs text-red-600">Terlambat</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{attendance.checkOut || '-'}</td>
                    <td className="px-4 py-2">
                      {attendance.checkOut ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                          Selesai
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                          Sedang Bertugas
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}