import { EmployeeAuth, UserOrgProfile } from '../types';

const STORAGE_EMPLOYEE_AUTH_KEY = 'sheetboard_employee_auth_v1';

export const DEMO_EMPLOYEES: Array<Omit<EmployeeAuth, 'isLoggedIn' | 'loginTime'>> = [
  {
    employeeId: 'EMP-1082',
    employeeName: 'Alex Rivera',
    employeeEmail: 'alex.rivera@organization.internal',
    orgId: 'ORG-MARKETING-9021',
    orgName: 'Global Marketing & Operations',
    department: 'Marketing & Strategy',
    role: 'Campaign Operations Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera',
  },
  {
    employeeId: 'EMP-1083',
    employeeName: 'Sarah Jenkins',
    employeeEmail: 'sarah.jenkins@organization.internal',
    orgId: 'ORG-MARKETING-9021',
    orgName: 'Global Marketing & Operations',
    department: 'Brand Design',
    role: 'Creative & Brand Director',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJenkins',
  },
  {
    employeeId: 'EMP-1084',
    employeeName: 'David Chen',
    employeeEmail: 'david.chen@organization.internal',
    orgId: 'ORG-MARKETING-9021',
    orgName: 'Global Marketing & Operations',
    department: 'Business Intelligence',
    role: 'Principal Data Analyst',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidChen',
  },
  {
    employeeId: 'EMP-1085',
    employeeName: 'Elena Rostova',
    employeeEmail: 'elena.rostova@organization.internal',
    orgId: 'ORG-GROWTH-4040',
    orgName: 'User Growth & Media Group',
    department: 'User Acquisition',
    role: 'Growth & Media Strategist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova',
  },
];

export function getStoredEmployeeAuth(): EmployeeAuth | null {
  try {
    const saved = localStorage.getItem(STORAGE_EMPLOYEE_AUTH_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isLoggedIn) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading employee auth:', err);
  }
  return null;
}

export function saveStoredEmployeeAuth(auth: EmployeeAuth | null): void {
  try {
    if (auth && auth.isLoggedIn) {
      localStorage.setItem(STORAGE_EMPLOYEE_AUTH_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_EMPLOYEE_AUTH_KEY);
    }
  } catch (err) {
    console.error('Error saving employee auth:', err);
  }
}

export function createEmployeeSession(data: {
  employeeId?: string;
  employeeName: string;
  employeeEmail?: string;
  orgId: string;
  orgName?: string;
  department?: string;
  role?: string;
  avatar?: string;
}): EmployeeAuth {
  const cleanOrgId = data.orgId.trim().toUpperCase() || 'ORG-DEFAULT-2026';
  const cleanEmpId =
    data.employeeId?.trim().toUpperCase() ||
    `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

  const auth: EmployeeAuth = {
    isLoggedIn: true,
    employeeId: cleanEmpId,
    employeeName: data.employeeName.trim() || 'Employee',
    employeeEmail:
      data.employeeEmail?.trim() ||
      `${data.employeeName.toLowerCase().replace(/\s+/g, '.')}@${cleanOrgId.toLowerCase()}.internal`,
    orgId: cleanOrgId,
    orgName: data.orgName?.trim() || `${cleanOrgId} Organization`,
    department: data.department?.trim() || 'Operations',
    role: data.role?.trim() || 'Team Member',
    avatar:
      data.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        data.employeeName.trim() || 'Employee'
      )}`,
    loginTime: new Date().toISOString(),
  };

  saveStoredEmployeeAuth(auth);
  return auth;
}

export function employeeToOrgProfile(auth: EmployeeAuth): UserOrgProfile {
  return {
    orgId: auth.orgId,
    orgName: auth.orgName,
    userId: auth.employeeId,
    userName: auth.employeeName,
    userRole: auth.role,
    userDept: auth.department,
    userEmail: auth.employeeEmail,
    userAvatar: auth.avatar,
  };
}
