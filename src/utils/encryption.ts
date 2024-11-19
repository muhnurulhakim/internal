import CryptoJS from 'crypto-js';

const SECRET_KEY = 'laa-royba-secret-key-2024';

export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};