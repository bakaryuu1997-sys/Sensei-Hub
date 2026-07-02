import * as React from 'react'

const DESKTOP_BREAKPOINT = 1024

/**
 * 大画面（Tailwind の lg 以上 = 1024px）かどうかを返す。
 *
 * 重い装飾（three.js の WebGL 惑星・全画面 starfield）をモバイル/タブレットでは
 * マウントせず、GPU 負荷とスクロール時のジャンクを抑えるために使う。
 * 初期値は false のため SSR とモバイルでは装飾を描かず、デスクトップでは
 * マウント後に true へ切り替わって描画が始まる（ハイドレーション不整合を避ける）。
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    const onChange = () => setIsDesktop(mql.matches)
    mql.addEventListener('change', onChange)
    setIsDesktop(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}
