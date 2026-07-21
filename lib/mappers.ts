import { ActivityLogEntry, Post, RoadmapPhase, SiteConfig, WaitlistSignup } from "@/types";

export function mapRoadmapPhase(row: {
  id: string;
  position: number;
  title: string;
  bullets: unknown;
  status: string;
}): RoadmapPhase {
  return {
    id: row.id,
    position: row.position,
    title: row.title,
    bullets: Array.isArray(row.bullets) ? (row.bullets as string[]) : [],
    status: row.status as RoadmapPhase["status"],
  };
}

export function mapPost(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    published: row.published,
    publishedAt: row.published_at ? row.published_at.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function mapWaitlistSignup(row: {
  id: string;
  email: string;
  source: string | null;
  ip_address: string | null;
  status: string;
  flag_reason: string | null;
  created_at: Date;
}): WaitlistSignup {
  return {
    id: row.id,
    email: row.email,
    source: row.source,
    ipAddress: row.ip_address,
    status: row.status as WaitlistSignup["status"],
    flagReason: row.flag_reason,
    createdAt: row.created_at.toISOString(),
  };
}

export function mapSiteConfig(row: { launch_live: boolean; token_address: string | null; buy_link: string | null }): SiteConfig {
  return {
    launchLive: row.launch_live,
    tokenAddress: row.token_address,
    buyLink: row.buy_link,
  };
}

export function mapActivityLog(row: {
  id: string;
  admin_user_id: string | null;
  action: string;
  metadata: unknown;
  created_at: Date;
}): ActivityLogEntry {
  return {
    id: row.id,
    adminUserId: row.admin_user_id,
    action: row.action,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: row.created_at.toISOString(),
  };
}
