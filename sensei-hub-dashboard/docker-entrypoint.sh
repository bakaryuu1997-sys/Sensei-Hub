#!/bin/sh
# コンテナのエントリポイント: SQLite スキーマを用意してから Next.js を起動する。
set -e

echo "[entrypoint] Prisma スキーマを $DATABASE_URL に適用中 ..."
pnpm prisma db push --skip-generate

echo "[entrypoint] レッスンインデックスを生成中 ..."
node scripts/build-lessons-index.mjs || echo "[entrypoint] index 生成をスキップ（フォールバックでファイル走査）"

echo "[entrypoint] Next.js をポート ${PORT:-3000} で起動中 ..."
exec pnpm start -p "${PORT:-3000}"
