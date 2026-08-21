import { Board, OrgMember, OrgMessage, UserOrgProfile, UserProfile } from '../types';
import { saveUserOrgProfile, saveConnectedOrgMembers, saveOrgMessages } from './orgMessageService';

export interface OnlineWorkspaceInfo {
  orgId: string;
  orgName: string;
  memberCount: number;
  onlineCount: number;
  updatedAt: string;
  hasBoard: boolean;
}

export interface OnlineWorkspaceFull {
  orgId: string;
  orgName: string;
  board: Board | null;
  members: OrgMember[];
  messages: OrgMessage[];
  updatedAt: string;
}

/**
 * Extract Org ID from browser URL query parameter (?org=...)
 */
export function getWorkspaceFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const org = params.get('org') || params.get('workspace') || params.get('board');
    if (org && org.trim()) {
      return org.trim().toUpperCase();
    }
  } catch (e) {
    // Ignore in non-browser context
  }
  return null;
}

/**
 * Update URL with current Org ID without reloading page
 */
export function setWorkspaceToUrl(orgId: string): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('org', orgId.trim().toUpperCase());
    window.history.replaceState({}, '', url.toString());
  } catch (e) {
    // Ignore
  }
}

/**
 * Generate shareable URL with Org ID parameter
 */
export function generateShareableWorkspaceUrl(orgId: string): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('org', orgId.trim().toUpperCase());
    return url.toString();
  } catch (e) {
    return window.location.href;
  }
}

/**
 * List all available online workspaces on the server
 */
export async function listOnlineWorkspaces(): Promise<OnlineWorkspaceInfo[]> {
  try {
    const res = await fetch('/api/workspaces');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch online workspaces list:', err);
  }
  return [];
}

/**
 * Fetch a specific online workspace by Org ID
 */
export async function fetchOnlineWorkspace(orgId: string): Promise<OnlineWorkspaceFull | null> {
  const cleanId = orgId.trim().toUpperCase();
  try {
    const res = await fetch(`/api/workspaces/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data: OnlineWorkspaceFull = await res.json();
      return data;
    }
  } catch (err) {
    console.warn(`Could not fetch online workspace ${cleanId}:`, err);
  }
  return null;
}

/**
 * Check-in / Log in to an online workspace
 */
export async function loginOnlineWorkspace(
  orgId: string,
  user: {
    displayName: string;
    email: string;
    role?: string;
    department?: string;
    orgName?: string;
  }
): Promise<{ success: boolean; user: UserProfile; workspace: OnlineWorkspaceFull }> {
  const cleanId = orgId.trim().toUpperCase();
  try {
    const res = await fetch(`/api/workspaces/${encodeURIComponent(cleanId)}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgName: user.orgName || `${cleanId} Workspace`,
        user: {
          uid: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          displayName: user.displayName,
          email: user.email,
          role: user.role || 'Marketing Specialist',
          department: user.department || 'Growth & Operations',
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName || cleanId)}`,
        },
      }),
    });

    if (res.ok) {
      const result = await res.json();
      const serverUser = result.user;
      const ws = result.workspace;

      // Sync into local caches as well
      const userProfile: UserProfile = {
        uid: serverUser.id,
        displayName: serverUser.name,
        email: serverUser.email,
        photoURL: serverUser.avatar,
      };

      const orgProfile: UserOrgProfile = {
        orgId: cleanId,
        orgName: ws.orgName,
        userId: serverUser.id,
        userName: serverUser.name,
        userRole: serverUser.role,
        userDept: serverUser.department,
        userEmail: serverUser.email,
        userAvatar: serverUser.avatar,
      };

      saveUserOrgProfile(orgProfile);
      if (ws.members) saveConnectedOrgMembers(cleanId, ws.members);
      if (ws.messages) saveOrgMessages(cleanId, ws.messages);
      setWorkspaceToUrl(cleanId);

      return {
        success: true,
        user: userProfile,
        workspace: ws,
      };
    }
  } catch (err) {
    console.warn('Online login fallback to local session:', err);
  }

  // Local fallback if server unreachable
  const fallbackUser: UserProfile = {
    uid: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    displayName: user.displayName || 'Local User',
    email: user.email || 'user@workspace.local',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName || cleanId)}`,
  };

  const localOrgProfile: UserOrgProfile = {
    orgId: cleanId,
    orgName: user.orgName || `${cleanId} Workspace`,
    userId: fallbackUser.uid,
    userName: fallbackUser.displayName || 'Local User',
    userRole: user.role || 'Member',
    userDept: user.department || 'Operations',
    userEmail: fallbackUser.email || '',
    userAvatar: fallbackUser.photoURL || '',
  };

  saveUserOrgProfile(localOrgProfile);
  setWorkspaceToUrl(cleanId);

  return {
    success: true,
    user: fallbackUser,
    workspace: {
      orgId: cleanId,
      orgName: localOrgProfile.orgName,
      board: null,
      members: [],
      messages: [],
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Broadcast & Sync Board Data to Online Workspace
 */
export async function syncBoardToOnlineWorkspace(
  orgId: string,
  board: Board,
  user?: UserProfile | null
): Promise<boolean> {
  const cleanId = orgId.trim().toUpperCase();
  try {
    const res = await fetch(`/api/workspaces/${encodeURIComponent(cleanId)}/board`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board,
        user,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to sync board online:', err);
    return false;
  }
}
