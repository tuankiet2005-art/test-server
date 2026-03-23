// Application layer - Use Cases

import { UserRepository, LeaveRequestRepository, AdvanceRequestRepository, ManagerRepository } from '../infrastructure/repositories';
import { User, LeaveRequest, AdvanceRequest, SalaryInfo } from '../domain/entities';

const userRepo = new UserRepository();
const leaveRepo = new LeaveRequestRepository();
const advanceRepo = new AdvanceRequestRepository();
const managerRepo = new ManagerRepository();

export class GetCurrentUserUseCase {
  async execute() {
    const userData = await userRepo.getCurrentUser();
    return new User(userData.id, userData.username, userData.role, userData.salary);
  }
}

export class ChangePasswordUseCase {
  async execute(currentPassword, newPassword) {
    return await userRepo.changePassword(currentPassword, newPassword);
  }
}

export class GetSalaryInfoUseCase {
  async execute(month) {
    const salaryData = await userRepo.getSalaryInfo(month);
    return new SalaryInfo(
      salaryData.month,
      salaryData.baseSalary,
      salaryData.totalAdvances,
      salaryData.totalDeductions,
      salaryData.netSalary
    );
  }
}

export class GetLeaveRequestsUseCase {
  async execute() {
    const requests = await leaveRepo.getAll();
    return requests.map(req => new LeaveRequest(
      req.id, req.userId, req.date, req.timePeriod, req.reason, req.status, req.createdAt
    ));
  }
}

export class CreateLeaveRequestUseCase {
  async execute(date, timePeriod, reason) {
    const requestData = { date, timePeriod, reason };
    const created = await leaveRepo.create(requestData);
    return new LeaveRequest(
      created.id, created.userId, created.date, created.timePeriod, created.reason, created.status, created.createdAt
    );
  }
}

export class GetAdvanceRequestsUseCase {
  async execute() {
    const requests = await advanceRepo.getAll();
    return requests.map(req => new AdvanceRequest(
      req.id, req.userId, req.amount, req.reason, req.status, req.createdAt
    ));
  }
}

export class CreateAdvanceRequestUseCase {
  async execute(amount, reason) {
    const requestData = { amount, reason };
    const created = await advanceRepo.create(requestData);
    return new AdvanceRequest(
      created.id, created.userId, created.amount, created.reason, created.status, created.createdAt
    );
  }
}

// Manager Use Cases
export class GetAllUsersUseCase {
  async execute() {
    const users = await managerRepo.getAllUsers();
    return users.map(u => new User(u.id, u.username, u.role, u.salary));
  }
}

export class CreateUserUseCase {
  async execute(username, password, role, salary) {
    const userData = { username, password, role, salary };
    const created = await managerRepo.createUser(userData);
    return new User(created.id, created.username, created.role, created.salary);
  }
}

export class UpdateUserUseCase {
  async execute(id, updates) {
    return await managerRepo.updateUser(id, updates);
  }
}

export class DeleteUserUseCase {
  async execute(id) {
    return await managerRepo.deleteUser(id);
  }
}

export class ResetUserPasswordUseCase {
  async execute(id) {
    return await managerRepo.resetUserPassword(id);
  }
}

export class GetAllLeaveRequestsUseCase {
  async execute() {
    const requests = await managerRepo.getAllLeaveRequests();
    return requests.map(req => new LeaveRequest(
      req.id, req.userId, req.date, req.timePeriod, req.reason, req.status, req.createdAt, req.managerCreated
    ));
  }
}

export class UpdateLeaveRequestStatusUseCase {
  async execute(id, status) {
    return await managerRepo.updateLeaveRequestStatus(id, status);
  }
}

export class CreateLeaveRequestForUserUseCase {
  async execute(userId, date, timePeriod, reason) {
    const requestData = { userId, date, timePeriod, reason };
    const created = await managerRepo.createLeaveRequestForUser(requestData);
    return new LeaveRequest(
      created.id, created.userId, created.date, created.timePeriod, created.reason, created.status, created.createdAt, true
    );
  }
}

export class GetAllAdvanceRequestsUseCase {
  async execute() {
    const requests = await managerRepo.getAllAdvanceRequests();
    return requests.map(req => new AdvanceRequest(
      req.id, req.userId, req.amount, req.reason, req.status, req.createdAt
    ));
  }
}

export class UpdateAdvanceRequestStatusUseCase {
  async execute(id, status, amount) {
    return await managerRepo.updateAdvanceRequestStatus(id, status, amount);
  }
}

export class CreateAdvanceRequestForUserUseCase {
  async execute(userId, amount, reason) {
    const requestData = { userId, amount, reason };
    const created = await managerRepo.createAdvanceRequestForUser(requestData);
    return new AdvanceRequest(
      created.id, created.userId, created.amount, created.reason, created.status, created.createdAt
    );
  }
}

export class GetPayrollDataUseCase {
  async execute(month) {
    return await managerRepo.getPayrollData(month);
  }
}

export class SetUserSalaryUseCase {
  async execute(userId, month, salary) {
    return await managerRepo.setUserSalary(userId, month, salary);
  }
}