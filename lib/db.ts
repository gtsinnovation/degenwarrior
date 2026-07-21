import { Pool, types } from "pg";

// Keep NUMERIC/DECIMAL columns as JS numbers rather than strings (node-postgres
// default). No numeric columns in this schema today, but this keeps behavior
// consistent if any are added later (e.g. analytics counters).
types.setTypeParser(1700, (value: string) => (value === null ? null : parseFloat(value)));

declare global {
  // eslint-disable-next-line no-var
  var __degenWarriorSitePool: Pool | undefined;
}

export const pool =
  global.__degenWarriorSitePool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.__degenWarriorSitePool = pool;
}
