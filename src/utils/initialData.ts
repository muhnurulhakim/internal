import { User } from '../types';
import { encryptData, hashPassword } from './encryption';

const initialUsers: User[] = [
  {
    id: '1',
    username: 'hakim',
    password: hashPassword('123456'),
    name: 'Hakim Manager',
    role: 'manager',
    shift: 1
  }
];

// Initialize data if not exists
export const initializeData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', encryptData(initialUsers));
  }
};