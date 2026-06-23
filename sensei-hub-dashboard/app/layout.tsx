import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n'
import { UserProgressProvider } from '@/components/user-progress-provider'
import { PwaRegistrar } from '@/components/pwa-registrar'
import { FloatingChat } from '@/components/floating-chat'
import { BottomNav } from '@/components/dashboard/bottom-nav'
import { InstallHint } from '@/components/install-hint'
import { Onboarding } from '@/components/onboarding'
import { StreakReminder } from '@/components/streak-reminder'
import { ClerkProvider } from "@clerk/nextjs"
import 'highlight.js/styles/atom-one-dark.css'
import 'katex/dist/katex.min.css'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SENSEI HUB - Focus & Flow Learning',
  description: 'Elevate your coding skills with focused learning experiences',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#030014',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // ノッチ端末でも全画面を使い、safe-area-inset-* を有効化する（PWA 全画面表示向け）
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen mesh-gradient">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
                window.dispatchEvent(new CustomEvent('pwa-prompt-active'));
              });
            `
          }}
        />
        <ClerkProvider>
          <LanguageProvider>
            <UserProgressProvider>
              {children}
              <FloatingChat />
              <BottomNav />
              <InstallHint />
              <Onboarding />
              <StreakReminder />
            </UserProgressProvider>
          </LanguageProvider>
        </ClerkProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <PwaRegistrar />
      </body>
    </html>
  )
}
