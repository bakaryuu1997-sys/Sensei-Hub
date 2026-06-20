#!/bin/sh
# コンテナのエントリポイント: SQLite スキーマを用意してから Next.js を起動する。
#
# 実行時は pnpm/corepack を使わず node で直接起動する。corepack はユーザーごとに
# キャッシュが分かれ、非 root 実行時に pnpm を再ダウンロードしようとして失敗する
# （オフライン EC2 では特に致命的）ため。ビルド時のみ pnpm を使う。
set -e

echo "[entrypoint] Prisma スキーマを $DATABASE_URL に適用中 ..."
# Prisma 7 では db push に --skip-generate は無い（クライアントはビルド時に生成済み）。
# また prisma.config.ts の env("DATABASE_URL") は db push 時に解決されないため、
# 実行時の DATABASE_URL を --url で明示的に渡す。
node node_modules/prisma/build/index.js db push --url "$DATABASE_URL"

echo "[entrypoint] レッスンインデックスを生成中 ..."
node scripts/build-lessons-index.mjs || echo "[entrypoint] index 生成をスキップ（フォールバックでファイル走査）"

echo "[entrypoint] Next.js をポート ${PORT:-3000} で起動中 ..."
exec node node_modules/next/dist/bin/next start -p "${PORT:-3000}"
