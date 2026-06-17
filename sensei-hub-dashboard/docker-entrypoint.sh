#!/bin/sh
# Container entrypoint: ensure the SQLite schema exists, then start Next.js.
set -e

echo "[entrypoint] Applying Prisma schema to $DATABASE_URL ..."
pnpm prisma db push --skip-generate

echo "[entrypoint] Starting Next.js on port ${PORT:-3000} ..."
exec pnpm start -p "${PORT:-3000}"
