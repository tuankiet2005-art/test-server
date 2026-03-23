// Application layer - Custom Hooks for state management

import { useState, useEffect } from 'react';
import {
  GetCurrentUserUseCase,
  ChangePasswordUseCase,
  GetSalaryInfoUseCase,
  GetLeaveRequestsUseCase,
  CreateLeaveRequestUseCase,
  GetAdvanceRequestsUseCase,
  CreateAdvanceRequestUseCase,
  GetAllUsersUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ResetUserPasswordUseCase,
  GetAllLeaveRequestsUseCase,
  UpdateLeaveRequestStatusUseCase,
  CreateLeaveRequestForUserUseCase,
  GetAllAdvanceRequestsUseCase,
  UpdateAdvanceRequestStatusUseCase,
  CreateAdvanceRequestForUserUseCase,
  GetPayrollDataUseCase,
  SetUserSalaryUseCase
} from './useCases';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const getUserUseCase = new GetCurrentUserUseCase();
        const currentUser = await getUserUseCase.execute();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const changePassword = async (currentPassword, newPassword) => {
    const useCase = new ChangePasswordUseCase();
    return await useCase.execute(currentPassword, newPassword);
  };

  return { user, setUser, loading, changePassword };
}

export function useLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const useCase = new GetLeaveRequestsUseCase();
      const requests = await useCase.execute();
      setLeaveRequests(requests);
    } catch (err) {
      setError('Failed to fetch leave requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createLeaveRequest = async (date, timePeriod, reason) => {
    setError('');
    try {
      const useCase = new CreateLeaveRequestUseCase();
      const newRequest = await useCase.execute(date, timePeriod, reason);
      setLeaveRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError('Failed to create leave request');
      throw err;
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return { leaveRequests, loading, error, fetchLeaveRequests, createLeaveRequest };
}

export function useAdvanceRequests() {
  const [advanceRequests, setAdvanceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdvanceRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const useCase = new GetAdvanceRequestsUseCase();
      const requests = await useCase.execute();
      setAdvanceRequests(requests);
    } catch (err) {
      setError('Failed to fetch advance requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAdvanceRequest = async (amount, reason) => {
    setError('');
    try {
      const useCase = new CreateAdvanceRequestUseCase();
      const newRequest = await useCase.execute(amount, reason);
      setAdvanceRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError('Failed to create advance request');
      throw err;
    }
  };

  useEffect(() => {
    fetchAdvanceRequests();
  }, []);

  return { advanceRequests, loading, error, fetchAdvanceRequests, createAdvanceRequest };
}

export function useSalaryInfo() {
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSalaryInfo = async (month) => {
    setLoading(true);
    setError('');
    try {
      const useCase = new GetSalaryInfoUseCase();
      const info = await useCase.execute(month);
      setSalaryInfo(info);
    } catch (err) {
      setError('Failed to fetch salary info');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { salaryInfo, loading, error, fetchSalaryInfo };
}

// Manager hooks
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const useCase = new GetAllUsersUseCase();
      const userList = await useCase.execute();
      setUsers(userList);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (username, password, role, salary) => {
    setError('');
    try {
      const useCase = new CreateUserUseCase();
      const newUser = await useCase.execute(username, password, role, salary);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError('Failed to create user');
      throw err;
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const useCase = new UpdateUserUseCase();
      await useCase.execute(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    } catch (err) {
      setError('Failed to update user');
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      const useCase = new DeleteUserUseCase();
      await useCase.execute(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError('Failed to delete user');
      throw err;
    }
  };

  const resetPassword = async (id) => {
    try {
      const useCase = new ResetUserPasswordUseCase();
      return await useCase.execute(id);
    } catch (err) {
      setError('Failed to reset password');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, resetPassword };
}

export function useManagerLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const useCase = new GetAllLeaveRequestsUseCase();
      const requests = await useCase.execute();
      setLeaveRequests(requests);
    } catch (err) {
      setError('Failed to fetch leave requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const useCase = new UpdateLeaveRequestStatusUseCase();
      await useCase.execute(id, status);
      setLeaveRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status } : req
      ));
    } catch (err) {
      setError('Failed to update leave request status');
      throw err;
    }
  };

  const createForUser = async (userId, date, timePeriod, reason) => {
    try {
      const useCase = new CreateLeaveRequestForUserUseCase();
      const newRequest = await useCase.execute(userId, date, timePeriod, reason);
      setLeaveRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError('Failed to create leave request for user');
      throw err;
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return { leaveRequests, loading, error, fetchLeaveRequests, updateStatus, createForUser };
}

export function useManagerAdvanceRequests() {
  const [advanceRequests, setAdvanceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdvanceRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const useCase = new GetAllAdvanceRequestsUseCase();
      const requests = await useCase.execute();
      setAdvanceRequests(requests);
    } catch (err) {
      setError('Failed to fetch advance requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, amount) => {
    try {
      const useCase = new UpdateAdvanceRequestStatusUseCase();
      await useCase.execute(id, status, amount);
      setAdvanceRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status, amount: amount || req.amount } : req
      ));
    } catch (err) {
      setError('Failed to update advance request status');
      throw err;
    }
  };

  const createForUser = async (userId, amount, reason) => {
    try {
      const useCase = new CreateAdvanceRequestForUserUseCase();
      const newRequest = await useCase.execute(userId, amount, reason);
      setAdvanceRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError('Failed to create advance request for user');
      throw err;
    }
  };

  useEffect(() => {
    fetchAdvanceRequests();
  }, []);

  return { advanceRequests, loading, error, fetchAdvanceRequests, updateStatus, createForUser };
}

export function usePayroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPayroll = async (month) => {
    setLoading(true);
    setError('');
    try {
      const useCase = new GetPayrollDataUseCase();
      const data = await useCase.execute(month);
      setPayrollData(data);
    } catch (err) {
      setError('Failed to fetch payroll data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setSalary = async (userId, month, salary) => {
    try {
      const useCase = new SetUserSalaryUseCase();
      await useCase.execute(userId, month, salary);
      // Refresh payroll data
      await fetchPayroll(month);
    } catch (err) {
      setError('Failed to set salary');
      throw err;
    }
  };

  return { payrollData, loading, error, fetchPayroll, setSalary };
}