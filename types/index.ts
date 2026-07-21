export type RoadmapStatus = "locked" | "active" | "completed";

export interface RoadmapPhase {
  id: string;
  position: number;
  title: string;
  bullets: string[];
  status: RoadmapStatus;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type WaitlistStatus = "pending" | "verified" | "flagged" | "rejected";

export interface WaitlistSignup {
  id: string;
  email: string;
  source: string | null;
  ipAddress: string | null;
  status: WaitlistStatus;
  flagReason: string | null;
  createdAt: string;
}

export interface SiteConfig {
  launchLive: boolean;
  tokenAddress: string | null;
  buyLink: string | null;
}

export interface ActivityLogEntry {
  id: string;
  adminUserId: string | null;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
}
