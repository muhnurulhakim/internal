import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { encryptData, decryptData, hashPassword } from '../utils/encryption';

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          const encryptedUsers = localStorage.getItem('users');
          if (!encryptedUsers) return false;

          const users: User[] = decryptData(encryptedUsers);
          const user = users.find(
            (u) => u.username === username && u.password === hashPassword(password)
          );

          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);