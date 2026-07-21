import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ROADMAP_PHASES = [
  {
    id: "launch-foundation",
    position: 1,
    title: "Launch & Foundation",
    bullets: [
      "Brand + Degen Sentinel tool live",
      "Community channels opened (X, Discord, Telegram)",
      "Whitelist / waitlist opens",
    ],
    status: "active",
  },
  {
    id: "expansion-growth",
    position: 2,
    title: "Expansion & Growth",
    bullets: ["Grow to 10k+ community members", "Meme contests + content series", "Influencer partnerships"],
    status: "locked",
  },
  {
    id: "utility-partnerships",
    position: 3,
    title: "Utility & Partnerships",
    bullets: ["Token generation event", "Exchange/aggregator listings", "Strategic partner integrations"],
    status: "locked",
  },
  {
    id: "global-community",
    position: 4,
    title: "Global Community & Development",
    bullets: ["Multi-language community hubs", "Governance experiments", "Long-term roadmap v2"],
    status: "locked",
  },
];

const POSTS = [
  {
    title: "Community Spotlight — Funniest Memes from Our Hodlers",
    slug: "community-spotlight-funniest-memes",
    excerpt: "We rounded up the best community memes from this week. Warning: some of these are unreasonably funny.",
    body: "Full post body coming soon.",
    published: true,
  },
  {
    title: "Top 5 Meme Coins Shaping the Future of Crypto Culture",
    slug: "top-5-meme-coins-shaping-crypto-culture",
    excerpt: "A look at the meme coins that turned internet culture into on-chain movements — and what we're learning from them.",
    body: "Full post body coming soon.",
    published: true,
  },
];

async function seed(): Promise<void> {
  console.log("[seed] applying schema...");
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const schema = await fs.readFile(path.resolve(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);

  console.log("[seed] seeding roadmap phases...");
  for (const phase of ROADMAP_PHASES) {
    await pool.query(
      `INSERT INTO roadmap_phases (id, position, title, bullets, status)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET position = EXCLUDED.position, title = EXCLUDED.title`,
      [phase.id, phase.position, phase.title, JSON.stringify(phase.bullets), phase.status]
    );
  }

  console.log("[seed] seeding posts...");
  for (const post of POSTS) {
    await pool.query(
      `INSERT INTO posts (title, slug, excerpt, body, published, published_at)
       VALUES ($1,$2,$3,$4,$5, now())
       ON CONFLICT (slug) DO NOTHING`,
      [post.title, post.slug, post.excerpt, post.body, post.published]
    );
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@degenwarrior.io";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  console.log(`[seed] seeding admin user ${adminEmail}...`);
  await pool.query(
    `INSERT INTO admin_users (email, password_hash, display_name)
     VALUES ($1,$2,'Admin')
     ON CONFLICT (email) DO NOTHING`,
    [adminEmail, passwordHash]
  );

  console.log("[seed] done.");
  await pool.end();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
