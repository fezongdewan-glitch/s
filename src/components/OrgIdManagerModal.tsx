import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  Copy,
  Check,
  Plus,
  Trash2,
  KeyRound,
  Sparkles,
  UserCheck,
  Briefcase,
  Layers,
  Mail,
  Shield,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { OrgMember, UserOrgProfile } from '../types';
import {
  addOrgMember,
  getConnectedOrgMembers,
  removeOrgMember,
  saveConnectedOrgMembers,
  saveUserOrgProfile,
} from '../services/orgMessageService';

interface OrgIdManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userOrgProfile: UserOrgProfile;
  onUpdateProfile: (updated: UserOrgProfile) => void;
  onMembersChange?: () => void;
}

export const OrgIdManagerModal: React.FC<OrgIdManagerModalProps> = ({
  isOpen,
  onClose,
  userOrgProfile,
  onUpdateProfile,
  onMembersChange,
}) => {
  const [activeTab, setActiveTab] = useState<'org-id' | 'members' | 'profile'>('org-id');
  const [inputOrgId, setInputOrgId] = useState(userOrgProfile.orgId);
  const [inputOrgName, setInputOrgName] = useState(userOrgProfile.orgName);
  
  // User profile inputs
  const [userName, setUserName] = useState(userOrgProfile.userName);
  const [userRole, setUserRole] = useState(userOrgProfile.userRole);
  const [userDept, setUserDept] = useState(userOrgProfile.userDept);
  const [userEmail, setUserEmail] = useState(userOrgProfile.userEmail);
  
  // Members state
  const [members, setMembers] = useState<OrgMember[]>(() =>
    getConnectedOrgMembers(userOrgProfile.orgId)
  );

  // New member form
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Campaign Specialist');
  const [newMemberDept, setNewMemberDept] = useState('Marketing & Operations');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberStatus, setNewMemberStatus] = useState<'online' | 'busy' | 'away'>('online');

  const [copiedId, setCopiedId] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText(userOrgProfile.orgId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleGenerateOrgId = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `ORG-TEAM-${randomSuffix}`;
    setInputOrgId(newId);
  };

  const handleSaveOrgSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputOrgId.trim().toUpperCase() || 'DEFAULT-ORG';
    const cleanName = inputOrgName.trim() || 'Team Organization';

    const updatedProfile: UserOrgProfile = {
      ...userOrgProfile,
      orgId: cleanId,
      orgName: cleanName,
    };

    onUpdateProfile(updatedProfile);
    saveUserOrgProfile(updatedProfile);

    // Refresh members for new org ID
    const newMembers = getConnectedOrgMembers(cleanId);
    setMembers(newMembers);
    if (onMembersChange) onMembersChange();

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      userName.trim() || 'User'
    )}`;

    const updatedProfile: UserOrgProfile = {
      ...userOrgProfile,
      userName: userName.trim(),
      userRole: userRole.trim(),
      userDept: userDept.trim(),
      userEmail: userEmail.trim(),
      userAvatar: avatar,
    };

    onUpdateProfile(updatedProfile);
    saveUserOrgProfile(updatedProfile);

    // Update current user entry in connected members
    const updatedMembers = members.map((m) => {
      if (m.name === userOrgProfile.userName || m.email === userOrgProfile.userEmail) {
        return {
          ...m,
          name: userName.trim(),
          role: userRole.trim(),
          department: userDept.trim(),
          email: userEmail.trim(),
          avatar,
        };
      }
      return m;
    });

    setMembers(updatedMembers);
    saveConnectedOrgMembers(userOrgProfile.orgId, updatedMembers);
    if (onMembersChange) onMembersChange();

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const created = addOrgMember(userOrgProfile.orgId, {
      name: newMemberName.trim(),
      role: newMemberRole.trim() || 'Team Member',
      department: newMemberDept.trim() || 'General',
      email: newMemberEmail.trim() || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@org.internal`,
      status: newMemberStatus,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        newMemberName.trim()
      )}`,
    });

    const updatedMembers = [...members, created];
    setMembers(updatedMembers);
    if (onMembersChange) onMembersChange();

    // Reset form
    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddMemberForm(false);
  };

  const handleRemoveMember = (memberId: string) => {
    removeOrgMember(userOrgProfile.orgId, memberId);
    const updated = members.filter((m) => m.id !== memberId);
    setMembers(updated);
    if (onMembersChange) onMembersChange();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        id="org-id-manager-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Organization Workspace &amp; ID</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {userOrgProfile.orgId}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Connect your team, manage your Org ID code, and add connected members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('org-id')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'org-id'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Organization ID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Connected Members ({members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>My Org Profile</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Organization settings updated successfully!</span>
            </div>
          )}

          {/* TAB 1: Organization ID & Switch */}
          {activeTab === 'org-id' && (
            <div className="space-y-6">
              {/* Active Org Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Active Organization ID
                    </span>
                  </div>
                  <div className="text-xl font-black font-mono text-indigo-950 dark:text-indigo-100">
                    {userOrgProfile.orgId}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {userOrgProfile.orgName} • {members.length} team members connected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyOrgId}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Org ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Form to Switch or Create Org ID */}
              <form onSubmit={handleSaveOrgSwitch} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span>Join or Switch Organization ID</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter the Org ID shared by your team manager or create your own custom workspace ID.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Organization ID Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputOrgId}
                        onChange={(e) => setInputOrgId(e.target.value.toUpperCase())}
                        placeholder="e.g. ORG-MARKETING-9021"
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleGenerateOrgId}
                        className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Generate Random Org ID"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Gen</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={inputOrgName}
                      onChange={(e) => setInputOrgName(e.target.value)}
                      placeholder="e.g. Global Marketing & Ops"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply &amp; Switch Org ID</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Connected Members connected through this Org ID */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Members in {userOrgProfile.orgId}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Team members who have joined using this Organization ID.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member to Org</span>
                </button>
              </div>

              {/* Add Member Form Drawer */}
              {showAddMemberForm && (
                <form
                  onSubmit={handleAddMemberSubmit}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Add New Member to Org ID: {userOrgProfile.orgId}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddMemberForm(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="e.g. Jordan Miller"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Role / Title
                      </label>
                      <input
                        type="text"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        placeholder="e.g. Creative Strategist"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Department
                      </label>
                      <input
                        type="text"
                        value={newMemberDept}
                        onChange={(e) => setNewMemberDept(e.target.value)}
                        placeholder="e.g. Growth & Design"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="e.g. jordan@organization.internal"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Status:</span>
                      {(['online', 'busy', 'away'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setNewMemberStatus(st)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                            newMemberStatus === st
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                    >
                      Save Member
                    </button>
                  </div>
                </form>
              )}

              {/* Members List */}
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover bg-slate-100 ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-800 ${
                            member.status === 'online'
                              ? 'bg-emerald-500'
                              : member.status === 'busy'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {member.name}
                          </span>
                          {member.name === userOrgProfile.userName && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {member.role} • {member.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      {member.email && (
                        <span className="hidden sm:inline text-[11px]">{member.email}</span>
                      )}
                      {member.name !== userOrgProfile.userName && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: My Org Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    userName || 'User'
                  )}`}
                  alt="Profile Avatar"
                  className="w-14 h-14 rounded-full bg-white ring-2 ring-indigo-500"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {userName || 'Your Name'}
                  </h4>
                  <p className="text-xs text-slate-500">{userRole} • {userDept}</p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                    Org: {userOrgProfile.orgId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Job Role / Title
                  </label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Department
                  </label>
                  <input
                    type="text"
                    value={userDept}
                    onChange={(e) => setUserDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
