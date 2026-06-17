"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n"

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("footer.links_title"),
      links: [
        { label: t("footer.home"), href: "/" },
        { label: t("footer.blog"), href: "/blog" },
        { label: t("footer.login"), href: "/login" },
      ],
    },
    {
      title: t("footer.legal_title"),
      links: [
        { label: t("footer.privacy"), href: "/privacy" },
        { label: t("footer.terms"), href: "/terms" },
      ],
    },
    {
      title: t("footer.connect_title"),
      links: [
        { label: t("footer.about"), href: "/about" },
        { label: t("footer.contact"), href: "/contact" },
      ],
    },
  ]

  return (
    <footer className="relative z-10 mt-12 border-t border-white/5 bg-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              SENSEI <span className="text-cyan-300">HUB.</span>
            </h2>
            <p className="mt-2 text-xs text-white/40 font-mono tracking-widest">{t("footer.motto")}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/65 hover:text-cyan-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-[11px] text-white/30 font-mono">
          © {year} SENSEI HUB · {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}
