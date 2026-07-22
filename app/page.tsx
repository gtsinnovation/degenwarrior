import { pool } from "@/lib/db";
import { mapPost, mapRoadmapPhase } from "@/lib/mappers";
import { SiteNav } from "@/components/site-nav";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { RoadmapSection } from "@/components/roadmap-section";
import { JoinRanksSection } from "@/components/join-ranks-section";
import { UpdatesSection } from "@/components/updates-section";
import { SiteFooter } from "@/components/site-footer";

// Queries Postgres directly at render time — without this, Next.js may try
// to statically prerender the homepage during `next build`, when no
// database is reachable yet (Postgres starts later as its own container).
export const dynamic = "force-dynamic";

async function getHomeData() {
  const [phasesResult, postsResult] = await Promise.all([
    pool.query(`SELECT id, position, title, bullets, status FROM roadmap_phases ORDER BY position ASC`),
    pool.query(`SELECT * FROM posts WHERE published = TRUE ORDER BY published_at DESC LIMIT 6`),
  ]);

  return {
    phases: phasesResult.rows.map(mapRoadmapPhase),
    posts: postsResult.rows.map(mapPost),
  };
}

export default async function HomePage() {
  const { phases, posts } = await getHomeData();

  return (
    <>
      <SiteNav />
      <main>
        <HeroSection />
        <AboutSection />
        <JoinRanksSection />
        <RoadmapSection phases={phases} />
        <UpdatesSection posts={posts} />
      </main>
      <SiteFooter />
    </>
  );
}
