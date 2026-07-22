# ── Degen Warrior marketing site — production image ─────────────────────
# Multi-stage build: install+build in a full node image, run in a slim one.
# Uses `npm install` (not `npm ci`) since package-lock.json isn't committed
# to the repo — regenerate/commit it locally if you want fully pinned,
# reproducible installs instead.

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# ── Stage 2: builder ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

RUN npm run build

# ── Stage 3: runner ────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy public assets from source (deps stage)
COPY --from=deps /app/public ./public

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]

# ── Separate image just for running db/seed.ts (schema + seed + admin
#    user creation) — needs full node_modules (tsx, pg, bcryptjs) and the
#    original TypeScript source, which the slim runner above deliberately
#    doesn't have. Run with: docker compose run --rm migrate ──
FROM node:20-alpine AS migrator
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./
ENTRYPOINT ["npx", "tsx", "db/seed.ts"]
