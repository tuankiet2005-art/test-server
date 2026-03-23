// Shared utilities and constants

export const STATUS_OPTIONS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const TIME_PERIOD_OPTIONS = {
  ALL_DAY: 'all day',
  MORNING: 'morning',
  AFTERNOON: 'afternoon'
};

export const ROLE_OPTIONS = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager'
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const getCurrentMonth = () => {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
};

export const calculateDaysInMonth = (month) => {
  const [year, monthIndex] = month.split('-').map(Number);
  return new Date(year, monthIndex, 0).getDate();
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};