# Production Dockerfile for Sensei Hub Dashboard
FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm i --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm prisma generate

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy Prisma for migrations in production
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Copy lessons content (since app reads from ../lessons)
COPY --from=builder --chown=nextjs:nodejs /lessons ./lessons

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Note: In a real standalone build, you'd run node server.js
# But we need to ensure lessons directory is available at ../lessons
# For now, we will use a simplified runner if standalone needs specific pathing
CMD ["node", "server.js"]
