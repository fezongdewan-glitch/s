import React, { useState } from 'react';
import {
  Building2,
  Lock,
  User,
  Mail,
  Shield,
  KeyRound,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  Kanban,
  Zap,
} from 'lucide-react';
import { EmployeeAuth } from '../types';
import {
  DEMO_EMPLOYEES,
  createEmployeeSession,
} from '../services/employeeAuthService';

interface EmployeeLoginPageProps {
  onLoginSuccess: (auth: EmployeeAuth) => void;
  onContinueAsGuest?: () => void;
}

export const EmployeeLoginPage: React.FC<EmployeeLoginPageProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'quick'>('signin');
  
  // Custom Form state
  const [employeeId, setEmployeeId] = useState('EMP-1082');
  const [employeeName, setEmployeeName] = useState('Alex Rivera');
  const [employeeEmail, setEmployeeEmail] = useState('alex.rivera@organization.internal');
  const [orgId, setOrgId] = useState('ORG-MARKETING-9021');
  const [orgName, setOrgName] = useState('Global Marketing & Operations');
  const [department, setDepartment] = useState('Marketing & Strategy');
  const [role, setRole] = useState('Campaign Operations Lead');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim() || !orgId.trim()) return;

    const session = createEmployeeSession({
      employeeId,
      employeeName,
      employeeEmail,
      orgId,
      orgName,
      department,
      role,
    });

    onLoginSuccess(session);
  };

  const handleQuickLogin = (demo: typeof DEMO_EMPLOYEES[0]) => {
    const session = createEmployeeSession({
      employeeId: demo.employeeId,
      employeeName: demo.employeeName,
      employeeEmail: demo.employeeEmail,
      orgId: demo.orgId,
      orgName: demo.orgName,
      department: demo.department,
      role: demo.role,
      avatar: demo.avatar,
    });

    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      
      {/* Top Brand Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Kanban className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">SheetBoard</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Enterprise Portal
              </span>
            </div>
            <p className="text-xs text-slate-400">Campaign Management &amp; Organization Workspace</p>
          </div>
        </div>

        {onContinueAsGuest && (
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Continue as Guest / Preview →
          </button>
        )}
      </header>

      {/* Main Center Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Left Column: Form Section */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                <Shield className="w-4 h-4" />
                <span>Single Sign-On &amp; Org Authentication</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Employee Access Portal
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Sign in with your Organization ID and Employee credentials to access campaigns and team messenger.
              </p>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Employee Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('quick')}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  authMode === 'quick'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1-Click Verified Profiles
              </button>
            </div>

            {/* FORM 1: Custom Credentials Login */}
            {authMode === 'signin' ? (
              <form onSubmit={handleCustomLogin} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Organization ID */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Organization ID</span>
                    </label>
                    <input
                      type="text"
                      value={orgId}
                      onChange={(e) => setOrgId(e.target.value.toUpperCase())}
                      placeholder="e.g. ORG-MARKETING-9021"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-700 bg-slate-800/90 text-white uppercase placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>

                  {/* Employee ID */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Employee ID</span>
                    </label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                      placeholder="e.g. EMP-1082"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-700 bg-slate-800/90 text-white uppercase placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Employee Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>

                  {/* Work Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Work Email</span>
                    </label>
                    <input
                      type="email"
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                      placeholder="e.g. alex.rivera@organization.internal"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Department</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Marketing & Strategy">Marketing &amp; Strategy</option>
                      <option value="Brand Design">Brand Design &amp; Creative</option>
                      <option value="Business Intelligence">Business Intelligence &amp; Data</option>
                      <option value="User Acquisition">User Acquisition &amp; Media</option>
                      <option value="Product Operations">Product Operations</option>
                      <option value="Executive Leadership">Executive Leadership</option>
                      <option value="Engineering & QA">Engineering &amp; QA</option>
                    </select>
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Job Title / Role</span>
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Campaign Operations Lead"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Password / PIN */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Security PIN / Password</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Encrypted SSO</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security PIN or password"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <span>Sign In as Employee</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* TAB 2: Quick Demo Profiles for instant testing */
              <div className="space-y-2.5">
                <p className="text-xs text-slate-400">
                  Select a verified employee profile below for instant authentication into their Organization ID workspace:
                </p>

                <div className="space-y-2">
                  {DEMO_EMPLOYEES.map((emp) => (
                    <button
                      key={emp.employeeId}
                      type="button"
                      onClick={() => handleQuickLogin(emp)}
                      className="w-full p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-750 border border-slate-700/80 hover:border-indigo-500/60 text-left flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.employeeName}
                          className="w-10 h-10 rounded-full bg-slate-700 ring-2 ring-indigo-500/30 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                              {emp.employeeName}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                              {emp.employeeId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {emp.role} • {emp.department}
                          </p>
                          <p className="text-[10px] text-indigo-400 font-mono">
                            Org: {emp.orgId}
                          </p>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-700 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Organization Features Overview */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-850/80 border border-slate-800/80 space-y-4">
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400">
                Connected Workspace
              </span>
              <h3 className="text-base font-bold text-white">
                Synchronized Organization Experience
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly to your team's live Google Sheet campaigns, real-time channels, and milestone ETAs.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Org ID Isolation:</strong> Channels and direct messages are strictly scoped to your team's Organization ID.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Campaign Milestones:</strong> Reference active cards with start dates &amp; ETAs in live discussion threads.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="p-1 rounded bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Live 2-Way Sync:</strong> Instantly updates connected Google Sheets when campaigns move.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Session Status */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Security Protocol:</span>
                <span className="text-emerald-400 font-bold">256-bit TLS Encrypted</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Default Org ID:</span>
                <span className="font-mono text-indigo-400 font-bold">ORG-MARKETING-9021</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 relative z-10">
        SheetBoard Enterprise Workspace • Designed for Cross-Functional Campaign Execution
      </footer>
    </div>
  );
};
