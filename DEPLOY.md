# Deploying Degen Warrior to a Hetzner VPS

This app ships as a Docker Compose stack: the Next.js site, Postgres, Redis,
and Caddy (automatic HTTPS via Let's Encrypt) — four containers, one command
to start them all.

## 1. Provision the server

- Create a Hetzner Cloud server — a **CX22** (2 vCPU / 4GB RAM) is plenty to
  start. Choose Ubuntu 24.04.
- Point your domain's DNS at the server:
  - `A` record: `degenwarrior.io` → your server's IPv4
  - `A` record: `www.degenwarrior.io` → your server's IPv4
  - (Caddy needs DNS resolved *before* it can issue a certificate — do this
    first and give it a few minutes to propagate.)

## 2. Install Docker on the server

SSH into the server, then:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# log out and back in for the group change to take effect
```

## 3. Copy the project to the server

From your local machine (where you unzipped the project):

```bash
scp -r degen-warrior-site root@YOUR_SERVER_IP:/root/degen-warrior-site
```

Or, if you push this to a git repo (recommended for future updates):

```bash
git clone <your-repo-url> /root/degen-warrior-site
```

## 4. Configure environment variables

On the server:

```bash
cd /root/degen-warrior-site
cp .env.production.example .env
nano .env   # fill in real values — see below
```

Generate strong secrets instead of leaving the placeholders:

```bash
openssl rand -base64 32   # use for POSTGRES_PASSWORD
openssl rand -base64 48   # use for JWT_SECRET
```

Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` to your real admin login —
this becomes the first account you use to log into `/admin`.

## 5. Build and start everything

```bash
docker compose up -d --build
```

This starts Postgres, Redis, the app, and Caddy. Caddy will automatically
request and renew HTTPS certificates for the domains listed in `Caddyfile`
the first time it sees traffic — no manual certbot steps needed.

## 6. Apply the database schema + create the admin user

Run this once, after the stack is up (it needs Postgres already running):

```bash
docker compose run --rm migrate
```

This applies `db/schema.sql`, seeds the 4 roadmap phases + 2 demo posts, and
creates your admin login from `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`.

## 7. Verify

- Visit `https://www.degenwarrior.io` — should load the public site.
- Visit `https://www.degenwarrior.io/admin/login` — log in with your admin
  credentials and confirm the dashboard loads.

## Updating the site later

```bash
cd /root/degen-warrior-site
git pull                       # or re-copy updated files
docker compose up -d --build   # rebuilds only what changed
```

Database data persists across rebuilds/restarts (it lives in the
`postgres_data` Docker volume) — you never need to re-run `migrate` unless
the schema itself changes.

## Common issues

| Symptom | Fix |
|---|---|
| Caddy can't get a certificate | DNS hasn't propagated yet, or ports 80/443 are blocked by a firewall — run `sudo ufw allow 80,443/tcp` |
| `app` container keeps restarting | Check logs: `docker compose logs app` — usually a missing/wrong env var |
| Admin login fails after fresh deploy | Did you run `docker compose run --rm migrate`? That's what creates the admin user |
| Need to reset the admin password | `docker compose run --rm migrate` is safe to re-run — it only inserts the admin user if the email doesn't already exist. To change an existing password, connect to Postgres directly and update it, or drop the `admin_users` row first |

## Backing up the database

```bash
docker compose exec postgres pg_dump -U degen degen_warrior_site > backup-$(date +%F).sql
```

Store these backups off-server (e.g. sync to another machine or object storage).
