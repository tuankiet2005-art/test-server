// Infrastructure layer - Repositories for API interactions

import api from '../../services/auth';

export class UserRepository {
  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/users/me/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  async getSalaryInfo(month) {
    const response = await api.get(`/users/me/salary/${month}`);
    return response.data;
  }
}

export class LeaveRequestRepository {
  async getAll() {
    const response = await api.get('/leave-requests');
    return response.data;
  }

  async create(leaveRequest) {
    const response = await api.post('/leave-requests', leaveRequest);
    return response.data;
  }
}

export class AdvanceRequestRepository {
  async getAll() {
    const response = await api.get('/advance-requests');
    return response.data;
  }

  async create(advanceRequest) {
    const response = await api.post('/advance-requests', advanceRequest);
    return response.data;
  }
}

export class ManagerRepository {
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  }

  async createUser(user) {
    const response = await api.post('/users', user);
    return response.data;
  }

  async updateUser(id, user) {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  }

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  async resetUserPassword(id) {
    const response = await api.put(`/users/${id}/reset-password`);
    return response.data;
  }

  async getAllLeaveRequests() {
    const response = await api.get('/leave-requests/all');
    return response.data;
  }

  async updateLeaveRequestStatus(id, status) {
    const response = await api.put(`/leave-requests/${id}/status`, { status });
    return response.data;
  }

  async createLeaveRequestForUser(leaveRequest) {
    const response = await api.post('/leave-requests/manager', leaveRequest);
    return response.data;
  }

  async getAllAdvanceRequests() {
    const response = await api.get('/advance-requests/all');
    return response.data;
  }

  async updateAdvanceRequestStatus(id, status, amount) {
    const response = await api.put(`/advance-requests/${id}/status`, { status, amount });
    return response.data;
  }

  async createAdvanceRequestForUser(advanceRequest) {
    const response = await api.post('/advance-requests/manager', advanceRequest);
    return response.data;
  }

  async getPayrollData(month) {
    const response = await api.get(`/payroll/${month}`);
    return response.data;
  }

  async setUserSalary(userId, month, salary) {
    const response = await api.put(`/users/${userId}/salary`, { month, salary });
    return response.data;
  }
}