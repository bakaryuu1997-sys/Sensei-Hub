# Production Dockerfile for Sensei Hub Dashboard (single-instance EC2)
#
# Build context MUST be the repository root (see docker-compose.yml), because
# the app lives in ./sensei-hub-dashboard and the lessons content lives in
# ./lessons — both are needed in the image.
#
# Runs with `next start` (not standalone) so that the Prisma CLI and the libSQL
# SQLite database can be initialised at container start via `prisma db push`.

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Install dependencies
FROM base AS deps
WORKDIR /app
COPY sensei-hub-dashboard/package.json sensei-hub-dashboard/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY sensei-hub-dashboard/ ./

# NEXT_PUBLIC_* are inlined at build time, so they must be build args.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm prisma generate
RUN pnpm build

# 3. Runtime image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV LESSONS_DIR=/lessons

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# App + dependencies (full node_modules so the Prisma CLI is available at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Lessons content (read at request time from $LESSONS_DIR)
COPY --chown=nextjs:nodejs lessons/ /lessons

# Persistent SQLite location (mount a volume here in compose)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
