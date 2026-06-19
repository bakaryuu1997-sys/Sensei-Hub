#!/bin/sh
# SQLite 学習進捗 DB（Docker ボリューム web_data）をバックアップする。
# 使い方: ./scripts/backup-db.sh [出力ディレクトリ]（既定: ./backups）
set -e

OUT_DIR="${1:-./backups}"
VOLUME="${WEB_DATA_VOLUME:-sensei-hub_web_data}"
mkdir -p "$OUT_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"

docker run --rm \
  -v "${VOLUME}:/data:ro" \
  -v "$(cd "$OUT_DIR" && pwd):/backup" \
  alpine tar czf "/backup/sensei-db-${STAMP}.tar.gz" -C /data .

echo "Backup written to ${OUT_DIR}/sensei-db-${STAMP}.tar.gz"
