import { NextResponse } from "next/server"

// 死活監視用エンドポイント。Docker / ロードバランサーのヘルスチェックに使う。
export function GET() {
  return NextResponse.json({ status: "ok", time: new Date().toISOString() })
}
