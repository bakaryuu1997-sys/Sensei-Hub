# Sensei Hub の本番用 Dockerfile（単一 EC2 向け）
#
# この Dockerfile・docker-compose・.dockerignore・docker-entrypoint.sh はリポジトリルートに置く。
# ビルドはリポジトリルートから実行する:
#     docker build -t sensei-hub .
# アプリ（./sensei-hub-dashboard）とレッスン（./lessons）の両方をイメージに含めるため、
# ビルドコンテキストは必ずリポジトリルートにする。
#
# standalone ではなく `next start` で起動する。コンテナ起動時に `prisma db push` を
# 実行できるよう、Prisma CLI と libSQL の SQLite を利用可能にするため。

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
# pnpm はロックファイル（lockfileVersion 9.0 / CI と同じ系列）に合わせてバージョンを固定する。
# `pnpm@latest` は非決定的でロックファイル非互換になり得るため避ける。
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# 低速・不安定なネットワークでも pnpm install が完走できるよう耐性を上げる。
# network-concurrency を下げて 1 接続あたりの帯域を確保し、timeout / retries を延ばす。
# （deps と deps-prod が並列実行され回線を奪い合うため、同時接続数の抑制が効く）
ENV npm_config_fetch_retries=5 \
    npm_config_fetch_retry_mintimeout=20000 \
    npm_config_fetch_retry_maxtimeout=120000 \
    npm_config_fetch_timeout=600000 \
    npm_config_network_concurrency=4

# 1. 依存関係のインストール（ビルド用・全 deps）
FROM base AS deps
WORKDIR /app
COPY sensei-hub-dashboard/package.json sensei-hub-dashboard/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 1b. 本番依存のみ（runner 用）。typescript/eslint/vitest/playwright 等の開発依存を
#     含めずイメージを軽量化する。Prisma CLI / @prisma/config / dotenv は実行時に必要なため
#     dependencies に移してある。Prisma クライアントもここで生成しておく。
FROM base AS deps-prod
WORKDIR /app
COPY sensei-hub-dashboard/package.json sensei-hub-dashboard/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY sensei-hub-dashboard/prisma ./prisma
COPY sensei-hub-dashboard/prisma.config.ts ./prisma.config.ts
# prisma.config.ts は DATABASE_URL を必須解決する。生成は実 DB に接続しないためダミーで十分。
ENV DATABASE_URL="file:/tmp/build.db"
RUN pnpm prisma generate
# `next start` に SWC ネイティブ（コンパイラ。約 120MB）は不要なので削除して軽量化する。
# 実コンテナで起動・db push ともに問題ないことを確認済み。
RUN rm -rf node_modules/.pnpm/@next+swc-* node_modules/@next/swc-*

# 実行時（next start のサーバー）に不要な依存を削除して大幅に軽量化する。
# 対象は「クライアント専用（.next/static に既にバンドル済み・dynamic import）」「開発/テスト
# 専用」「Prisma Studio（db push には不要）」。サーバーは読み込まないため安全。
# ※ highlight.js（サーバーのレッスン整形）・lucide-react・date-fns・marked 等は実行時に
#   使うため残す。
RUN cd node_modules \
 && rm -rf mermaid katex three @codemirror @uiw typescript sharp @img \
           playwright-core @playwright \
 && rm -rf .pnpm/mermaid@* .pnpm/katex@* .pnpm/three@* \
           .pnpm/@codemirror+* .pnpm/@uiw+* .pnpm/typescript@* \
           .pnpm/sharp@* .pnpm/@img+* \
           .pnpm/playwright-core@* .pnpm/@playwright+*
# ※ @prisma/studio-core と @electric-sql/pglite は prisma CLI が起動時に eager require する
#   ため削除しない（db push が "Cannot find module @prisma/studio-core" で失敗する）。

# 2. アプリのビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY sensei-hub-dashboard/ ./

# NEXT_PUBLIC_* はビルド時に埋め込まれるため、ビルド引数として渡す必要がある。
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
# Web Push の公開鍵もビルド時に埋め込む（任意。未指定なら通知機能は自動で無効）。
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY=""
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=$NEXT_PUBLIC_VAPID_PUBLIC_KEY
ENV NEXT_TELEMETRY_DISABLED=1
# prisma.config.ts は DATABASE_URL を必須で解決する。ビルド時（generate / build）は実 DB に
# 接続しないためダミーで十分。実値は実行時に compose / docker run の env で渡す。
ENV DATABASE_URL="file:/tmp/build.db"

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY はビルド時に埋め込む必須値。未指定だとビルドは通るのに
# 実行時に Clerk が 500（Missing publishableKey）になり分かりにくいため、ここで早期に失敗させる。
RUN test -n "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" || ( \
      echo "ERROR: build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required." && \
      echo "  例: docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx -t sensei-hub ." && \
      exit 1 )

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

# 依存関係は「本番のみ」の node_modules を使う（deps-prod。Prisma クライアント生成済み）。
COPY --from=deps-prod --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./next.config.mjs
# entrypoint はリポジトリルートに置いてあるため、ビルドコンテキストから直接コピーする。
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
# レッスンインデックス生成スクリプト（entrypoint で実行）
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# レッスンコンテンツ（リクエスト時に $LESSONS_DIR から読む）
COPY --chown=nextjs:nodejs lessons/ /lessons

# SQLite の永続化先（compose でここにボリュームをマウント）
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

# compose を使わない `docker run`（EC2 で ECR から pull する場合）でも死活監視できるよう、
# イメージ自体にヘルスチェックを持たせる。compose 側の healthcheck はこれを上書きできる。
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
