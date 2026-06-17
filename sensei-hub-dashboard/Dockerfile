# Sensei Hub ダッシュボードの本番用 Dockerfile（単一 EC2 向け）
#
# ビルドコンテキストはリポジトリルートでなければならない（docker-compose.yml 参照）。
# アプリは ./sensei-hub-dashboard に、レッスンは ./lessons にあり、どちらもイメージに
# 必要なため。
#
# standalone ではなく `next start` で起動する。コンテナ起動時に `prisma db push` を
# 実行できるよう、Prisma CLI と libSQL の SQLite を利用可能にするため。

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. 依存関係のインストール
FROM base AS deps
WORKDIR /app
COPY sensei-hub-dashboard/package.json sensei-hub-dashboard/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. アプリのビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY sensei-hub-dashboard/ ./

# NEXT_PUBLIC_* はビルド時に埋め込まれるため、ビルド引数として渡す必要がある。
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm prisma generate
RUN pnpm build

# 3. 実行用イメージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV LESSONS_DIR=/lessons

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# アプリ + 依存関係（実行時に Prisma CLI を使えるよう node_modules 全体をコピー）
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh

# レッスンコンテンツ（リクエスト時に $LESSONS_DIR から読む）
COPY --chown=nextjs:nodejs lessons/ /lessons

# SQLite の永続化先（compose でここにボリュームをマウント）
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
