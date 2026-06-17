# Deployment — AWS EC2 (Docker)

> Updated: 2026-06-17

Sensei Hub deploys to a **single AWS EC2 instance** using Docker Compose. There
is no managed database — the app uses SQLite on a Docker volume.

## 1. Prerequisites

- An EC2 instance (Ubuntu 22.04+ recommended, `t3.small` or larger).
- Security group inbound: `22` (SSH), `80`/`443` (web). The app's port `3000`
  does not need to be public if you front it with Nginx/ALB.
- A Clerk application (production instance) with its publishable and secret keys.

## 2. Install Docker on the host

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # re-login afterwards
```

The Docker Engine ships the `docker compose` plugin.

## 3. Get the code and configure secrets

```bash
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd Sensei-Hub

# Create a .env next to docker-compose.yml (read by Compose):
cat > .env <<'EOF'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxx
EOF
```

`DATABASE_URL`, `LESSONS_DIR`, and the Clerk sign-in/up URLs are already set in
`docker-compose.yml`. Note that `NEXT_PUBLIC_*` values are **build-time** — they
are baked into the image during `docker compose build`.

## 4. Build and run

```bash
docker compose up -d --build
```

What happens:

- The image is built from `sensei-hub-dashboard/Dockerfile` (build context is the
  repo root, so `lessons/` is included).
- On start, `docker-entrypoint.sh` runs `prisma db push` to create the SQLite
  schema, then `next start` on port 3000.
- The SQLite file is stored on the named volume `web_data` (`/app/data/production.db`)
  and survives `docker compose down` / redeploys.
- `lessons/` is mounted read-only at `/lessons`.

Check it:

```bash
docker compose ps
docker compose logs -f web
curl -I http://localhost:3000
```

## 5. Reverse proxy (recommended)

Put Nginx in front to serve HTTP/HTTPS on 80/443:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Use Certbot (Let's Encrypt) for TLS.

## 6. Updating

```bash
git pull
docker compose up -d --build
```

- Lesson content updates take effect on the next request (read from the mounted
  `lessons/`); no rebuild strictly required for content-only changes.
- Changing the **Clerk publishable key** requires a rebuild (it is inlined at
  build time).

## 7. Backups & operational notes

- **Backup** the `web_data` volume to preserve learner progress:
  ```bash
  docker run --rm -v sensei-hub_web_data:/data -v $PWD:/backup alpine \
    tar czf /backup/sensei-db-$(date +%F).tar.gz -C /data .
  ```
- The in-memory **cache and rate-limiter reset** whenever the container restarts,
  and are per-process — fine for one instance, not for horizontal scaling.
- Logs: `docker compose logs -f web`.

## 8. Schema note

`User.password` was removed (Clerk is the only auth). If you have an old
`dev.db`/`production.db` created before this change, `prisma db push` reconciles
the schema automatically; no manual migration is needed.
