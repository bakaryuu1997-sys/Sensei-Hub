# Android App Customization & PWA Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Android wrapper application with a native toolbar, Server IP selection dialog, and complete the Progressive Web App (PWA) manifest and installation flow for browser users.

**Architecture:** Use client-side event dispatching for the PWA install prompt in Next.js, and Android `SharedPreferences` paired with Compose UI components in Kotlin to support a dynamic WebView base URL and navigation controls.

**Tech Stack:** Next.js (TypeScript), Service Worker API, Web App Manifest API, Jetpack Compose, Kotlin, Android WebView.

---

### Task 1: PWA Web App Manifest

**Files:**
- Create: `sensei-hub-dashboard/public/manifest.json`
- Modify: `sensei-hub-dashboard/app/layout.tsx:20-41`

- [ ] **Step 1: Create the PWA Manifest file**
  Create `sensei-hub-dashboard/public/manifest.json` with identity attributes, background colors matching the space theme, and references to the existing `sensei-mascot` icon.

  ```json
  {
    "name": "Sensei Hub",
    "short_name": "SenseiHub",
    "description": "Master the Universe of IT - Focus & Flow Learning",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#030014",
    "theme_color": "#080710",
    "orientation": "portrait",
    "icons": [
      {
        "src": "/images/sensei-mascot.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/images/sensei-mascot.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ]
  }
  ```

- [ ] **Step 2: Link manifest in Next.js root layout metadata**
  Modify `sensei-hub-dashboard/app/layout.tsx` to add `manifest: '/manifest.json'` to the `metadata` object.

  Target content:
  ```typescript
  export const metadata: Metadata = {
    title: 'SENSEI HUB - Focus & Flow Learning',
    description: 'Elevate your coding skills with focused learning experiences',
    generator: 'v0.app',
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
  ```

  Replacement content:
  ```typescript
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
  ```

- [ ] **Step 3: Verify manifest linking**
  Run compilation to make sure typescript does not error.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  Expected: Successful next build without metadata type errors.

- [ ] **Step 4: Commit**
  ```bash
  git add sensei-hub-dashboard/public/manifest.json sensei-hub-dashboard/app/layout.tsx
  git commit -m "pwa: add manifest.json and link in layout metadata"
  ```

---

### Task 2: Service Worker

**Files:**
- Create: `sensei-hub-dashboard/public/sw.js`

- [ ] **Step 1: Create service worker static asset caching script**
  Create `sensei-hub-dashboard/public/sw.js` containing the logic to pre-cache major assets and dynamic pages with local fallback support.

  ```javascript
  const CACHE_NAME = 'sensei-hub-v1';
  const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/images/sensei-mascot.png',
    '/images/mascot-robot.png',
    '/images/cosmic-bg.png'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
      return;
    }
    
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          return caches.match('/');
        });
      })
    );
  });
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add sensei-hub-dashboard/public/sw.js
  git commit -m "pwa: add custom static caching service worker"
  ```

---

### Task 3: PWA Client Registrar

**Files:**
- Create: `sensei-hub-dashboard/components/pwa-registrar.tsx`
- Modify: `sensei-hub-dashboard/app/layout.tsx:48-65`

- [ ] **Step 1: Create the PwaRegistrar client component**
  Create `sensei-hub-dashboard/components/pwa-registrar.tsx` to handle window prompt binding and service worker registration.

  ```typescript
  "use client"

  import { useEffect } from "react"

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed'
      platform: string
    }>
    prompt(): Promise<void>
  }

  declare global {
    interface Window {
      deferredPrompt: BeforeInstallPromptEvent | null
    }
  }

  export function PwaRegistrar() {
    useEffect(() => {
      // Register Service Worker
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker.register("/sw.js").then(
            (registration) => {
              console.log("ServiceWorker registration successful with scope: ", registration.scope)
            },
            (err) => {
              console.log("ServiceWorker registration failed: ", err)
            }
          )
        })
      }

      // Handle beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        window.deferredPrompt = e as BeforeInstallPromptEvent
        // Dispatch custom event to notify buttons
        window.dispatchEvent(new CustomEvent("pwa-prompt-active"))
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    }, [])

    return null
  }
  ```

- [ ] **Step 2: Mount PwaRegistrar in Root Layout**
  Modify `sensei-hub-dashboard/app/layout.tsx` to mount `<PwaRegistrar />` at the bottom of the body tag.

  Target content:
  ```typescript
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="font-sans antialiased min-h-screen mesh-gradient">
          <LanguageProvider>
            <UserProgressProvider>
              {children}
            </UserProgressProvider>
          </LanguageProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    )
  }
  ```

  Replacement content:
  ```typescript
  import { PwaRegistrar } from '@/components/pwa-registrar'

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="font-sans antialiased min-h-screen mesh-gradient">
          <LanguageProvider>
            <UserProgressProvider>
              {children}
            </UserProgressProvider>
          </LanguageProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <PwaRegistrar />
        </body>
      </html>
    )
  }
  ```

- [ ] **Step 3: Verify compilation**
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  Expected: Successful typescript checks and output generation.

- [ ] **Step 4: Commit**
  ```bash
  git add sensei-hub-dashboard/components/pwa-registrar.tsx sensei-hub-dashboard/app/layout.tsx
  git commit -m "pwa: implement PwaRegistrar and mount in root layout"
  ```

---

### Task 4: PWA Install Buttons

**Files:**
- Modify: `sensei-hub-dashboard/components/dashboard/sidebar.tsx`
- Modify: `sensei-hub-dashboard/components/dashboard/top-bar.tsx`

- [ ] **Step 1: Add install button in Sidebar**
  Modify `sensei-hub-dashboard/components/dashboard/sidebar.tsx` to include the install prompt trigger above the footer brand.

  Target content:
  ```typescript
        {/* Footer brand */}
        <div className="p-4 border-t border-white/5">
          <div className="text-[10px] text-white/30 font-mono tracking-widest text-center">
            FOCUS · FLOW · MASTERY
          </div>
        </div>
  ```

  Replacement content:
  ```typescript
        {/* PWA Install Button */}
        {typeof window !== "undefined" && (
          <PwaInstallButton variant="sidebar" />
        )}

        {/* Footer brand */}
        <div className="p-4 border-t border-white/5">
          <div className="text-[10px] text-white/30 font-mono tracking-widest text-center">
            FOCUS · FLOW · MASTERY
          </div>
        </div>
  ```

  Also, add the `PwaInstallButton` component and imports at the bottom of the file (or define it in the same file).

  ```typescript
  import { useState, useEffect } from "react"
  import { Download } from "lucide-react"

  function PwaInstallButton({ variant }: { variant: "sidebar" | "topbar" }) {
    const [isInstallable, setIsInstallable] = useState(false)

    useEffect(() => {
      if (typeof window !== "undefined") {
        if (window.deferredPrompt) {
          setIsInstallable(true)
        }
        const handler = () => setIsInstallable(true)
        window.addEventListener("pwa-prompt-active", handler)
        return () => window.removeEventListener("pwa-prompt-active", handler)
      }
    }, [])

    const handleInstallClick = async () => {
      if (typeof window !== "undefined" && window.deferredPrompt) {
        const promptEvent = window.deferredPrompt
        promptEvent.prompt()
        const { outcome } = await promptEvent.userChoice
        if (outcome === "accepted") {
          window.deferredPrompt = null
          setIsInstallable(false)
        }
      }
    }

    if (!isInstallable) return null

    if (variant === "sidebar") {
      return (
        <motion.div variants={itemVariants} className="px-4 py-3 border-t border-white/5">
          <button
            onClick={handleInstallClick}
            className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-cyan-300 animate-bounce" />
            Tải App Sensei Hub
          </button>
        </motion.div>
      )
    }

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-xs font-bold text-white transition-all cursor-pointer"
      >
        <Download className="h-3.5 w-3.5 text-cyan-300" />
        Tải App
      </motion.button>
    )
  }
  ```

- [ ] **Step 2: Add install button in TopBar**
  Modify `sensei-hub-dashboard/components/dashboard/top-bar.tsx` to insert the install button in the action list for mobile/general users.

  Target content:
  ```typescript
        {/* Language Switcher */}
        <LanguageSwitcher />
  ```

  Replacement content:
  ```typescript
        {/* PWA Install Button */}
        {typeof window !== "undefined" && (
          <PwaInstallButton variant="topbar" />
        )}

        {/* Language Switcher */}
        <LanguageSwitcher />
  ```

  And import the same `PwaInstallButton` utility at the end of `top-bar.tsx`:

  ```typescript
  import { Download } from "lucide-react"

  function PwaInstallButton({ variant }: { variant: "sidebar" | "topbar" }) {
    const [isInstallable, setIsInstallable] = useState(false)

    useEffect(() => {
      if (typeof window !== "undefined") {
        if (window.deferredPrompt) {
          setIsInstallable(true)
        }
        const handler = () => setIsInstallable(true)
        window.addEventListener("pwa-prompt-active", handler)
        return () => window.removeEventListener("pwa-prompt-active", handler)
      }
    }, [])

    const handleInstallClick = async () => {
      if (typeof window !== "undefined" && window.deferredPrompt) {
        const promptEvent = window.deferredPrompt
        promptEvent.prompt()
        const { outcome } = await promptEvent.userChoice
        if (outcome === "accepted") {
          window.deferredPrompt = null
          setIsInstallable(false)
        }
      }
    }

    if (!isInstallable) return null

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-xs font-bold text-white transition-all cursor-pointer"
      >
        <Download className="h-3.5 w-3.5 text-cyan-300" />
        Tải App
      </motion.button>
    )
  }
  ```

- [ ] **Step 3: Compile and lint dashboard**
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  Expected: Builds correctly without missing imports or syntax issues.

- [ ] **Step 4: Commit**
  ```bash
  git add sensei-hub-dashboard/components/dashboard/sidebar.tsx sensei-hub-dashboard/components/dashboard/top-bar.tsx
  git commit -m "pwa: add download app buttons to Sidebar and TopBar layouts"
  ```

---

### Task 5: Android App Custom Settings & Storage

**Files:**
- Modify: `sensei-hub-android/app/src/main/java/com/example/senseihub/ui/main/MainScreen.kt`

- [ ] **Step 1: Replace MainScreen.kt content with settings dialog and dynamic toolbar controls**
  Modify `sensei-hub-android/app/src/main/java/com/example/senseihub/ui/main/MainScreen.kt` to include native toolbar buttons (quay lại, tiến lên, tải lại, cài đặt), SharedPreferences persistence, and dynamic URL change callbacks.

  ```kotlin
  package com.example.senseihub.ui.main

  import android.annotation.SuppressLint
  import android.content.Context
  import android.view.ViewGroup
  import android.webkit.WebChromeClient
  import android.webkit.WebResourceError
  import android.webkit.WebResourceRequest
  import android.webkit.WebSettings
  import android.webkit.WebView
  import android.webkit.WebViewClient
  import androidx.activity.compose.BackHandler
  import androidx.compose.animation.AnimatedVisibility
  import androidx.compose.animation.core.tween
  import androidx.compose.animation.fadeIn
  import androidx.compose.animation.fadeOut
  import androidx.compose.foundation.Image
  import androidx.compose.foundation.background
  import androidx.compose.foundation.border
  import androidx.compose.foundation.clickable
  import androidx.compose.foundation.layout.*
  import androidx.compose.foundation.shape.RoundedCornerShape
  import androidx.compose.material.icons.Icons
  import androidx.compose.material.icons.filled.ArrowBack
  import androidx.compose.material.icons.filled.ArrowForward
  import androidx.compose.material.icons.filled.Refresh
  import androidx.compose.material.icons.filled.Settings
  import androidx.compose.material3.*
  import androidx.compose.runtime.*
  import androidx.compose.ui.Alignment
  import androidx.compose.ui.Modifier
  import androidx.compose.ui.draw.clip
  import androidx.compose.ui.graphics.Brush
  import androidx.compose.ui.graphics.Color
  import androidx.compose.ui.layout.ContentScale
  import androidx.compose.ui.platform.LocalContext
  import androidx.compose.ui.res.painterResource
  import androidx.compose.ui.text.font.FontFamily
  import androidx.compose.ui.text.font.FontWeight
  import androidx.compose.ui.text.style.TextAlign
  import androidx.compose.ui.unit.dp
  import androidx.compose.ui.unit.sp
  import androidx.compose.ui.viewinterop.AndroidView
  import androidx.lifecycle.viewmodel.compose.viewModel
  import androidx.navigation3.runtime.NavKey
  import com.example.senseihub.R
  import com.example.senseihub.data.DefaultDataRepository
  import kotlinx.coroutines.delay

  private const val PREFS_NAME = "sensei_hub_prefs"
  private const val KEY_SERVER_URL = "server_url"
  private const val DEFAULT_URL = "http://10.0.2.2:3000"

  @Composable
  fun SplashScreen(onFinish: () -> Unit) {
      LaunchedEffect(Unit) {
          delay(2500)
          onFinish()
      }

      Box(
          modifier = Modifier
              .fillMaxSize()
              .background(
                  Brush.verticalGradient(
                      colors = listOf(Color(0xFF030014), Color(0xFF0D0B21))
                  )
              ),
          contentAlignment = Alignment.Center
      ) {
          Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              verticalArrangement = Arrangement.Center
          ) {
              Image(
                  painter = painterResource(id = R.drawable.mascot_sensei),
                  contentDescription = "Cosmic Sensei",
                  modifier = Modifier
                      .size(180.dp)
                      .clip(RoundedCornerShape(24.dp)),
                  contentScale = ContentScale.Fit
              )
              Spacer(modifier = Modifier.height(24.dp))
              Text(
                  text = "SENSEI HUB",
                  color = Color.White,
                  fontSize = 28.sp,
                  fontWeight = FontWeight.ExtraBold,
                  letterSpacing = 2.sp,
                  fontFamily = FontFamily.Monospace
              )
              Spacer(modifier = Modifier.height(8.dp))
              Text(
                  text = "Master the Universe of IT",
                  color = Color(0xFF22D3EE),
                  fontSize = 14.sp,
                  fontWeight = FontWeight.Medium,
                  fontFamily = FontFamily.SansSerif
              )
              Spacer(modifier = Modifier.height(48.dp))
              CircularProgressIndicator(
                  color = Color(0xFF8B5CF6),
                  strokeWidth = 3.dp,
                  modifier = Modifier.size(36.dp)
              )
          }
      }
  }

  @Composable
  fun OfflineScreen(onRetry: () -> Unit) {
      Box(
          modifier = Modifier
              .fillMaxSize()
              .background(Color(0xFF030014))
              .padding(24.dp),
          contentAlignment = Alignment.Center
      ) {
          Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              verticalArrangement = Arrangement.Center,
              modifier = Modifier.fillMaxWidth()
          ) {
              Icon(
                  painter = painterResource(id = android.R.drawable.stat_notify_error),
                  contentDescription = "Error",
                  tint = Color(0xFFF43F5E),
                  modifier = Modifier.size(64.dp)
              )
              Spacer(modifier = Modifier.height(24.dp))
              Text(
                  text = "Mất kết nối máy chủ",
                  color = Color.White,
                  fontSize = 20.sp,
                  fontWeight = FontWeight.Bold,
                  textAlign = TextAlign.Center
              )
              Spacer(modifier = Modifier.height(8.dp))
              Text(
                  text = "Không thể kết nối đến máy chủ học tập. Vui lòng kiểm tra lại địa chỉ cài đặt hoặc đường truyền mạng.",
                  color = Color.LightGray.copy(alpha = 0.7f),
                  fontSize = 14.sp,
                  textAlign = TextAlign.Center,
                  modifier = Modifier.padding(horizontal = 16.dp)
              )
              Spacer(modifier = Modifier.height(32.dp))
              Button(
                  onClick = onRetry,
                  colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B5CF6)),
                  shape = RoundedCornerShape(12.dp),
                  modifier = Modifier.height(48.dp)
              ) {
                  Text(text = "Thử lại", fontWeight = FontWeight.Bold)
              }
          }
      }
  }

  @OptIn(ExperimentalMaterial3Api::class)
  @SuppressLint("SetJavaScriptEnabled")
  @Composable
  fun MainScreen(
      onItemClick: (NavKey) -> Unit,
      modifier: Modifier = Modifier,
      viewModel: MainScreenViewModel = viewModel { MainScreenViewModel(DefaultDataRepository()) },
  ) {
      var showSplash by remember { mutableStateOf(true) }
      val context = LocalContext.current
      val sharedPreferences = remember { context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE) }
      
      var serverUrl by remember { 
          mutableStateOf(sharedPreferences.getString(KEY_SERVER_URL, DEFAULT_URL) ?: DEFAULT_URL) 
      }
      
      AnimatedVisibility(
          visible = showSplash,
          enter = fadeIn(),
          exit = fadeOut(animationSpec = tween(500))
      ) {
          SplashScreen(onFinish = { showSplash = false })
      }

      if (!showSplash) {
          var hasError by remember { mutableStateOf(false) }
          var loadingProgress by remember { mutableIntStateOf(0) }
          var webView: WebView? by remember { mutableStateOf(null) }
          var showSettingsDialog by remember { mutableStateOf(false) }

          // Web history navigation
          var canGoBack by remember { mutableStateOf(false) }
          var canGoForward by remember { mutableStateOf(false) }

          BackHandler(enabled = canGoBack && !hasError) {
              webView?.goBack()
          }

          Scaffold(
              topBar = {
                  TopAppBar(
                      title = {
                          Text(
                              text = "SENSEI HUB",
                              color = Color.White,
                              fontWeight = FontWeight.Bold,
                              fontFamily = FontFamily.Monospace,
                              fontSize = 18.sp
                          )
                      },
                      navigationIcon = {
                          IconButton(
                              onClick = { webView?.goBack() },
                              enabled = canGoBack
                          ) {
                              Icon(
                                  imageVector = Icons.Default.ArrowBack,
                                  contentDescription = "Back",
                                  tint = if (canGoBack) Color.White else Color.Gray
                              )
                          }
                      },
                      actions = {
                          IconButton(
                              onClick = { webView?.goForward() },
                              enabled = canGoForward
                          ) {
                              Icon(
                                  imageVector = Icons.Default.ArrowForward,
                                  contentDescription = "Forward",
                                  tint = if (canGoForward) Color.White else Color.Gray
                              )
                          }
                          IconButton(onClick = { 
                              hasError = false
                              loadingProgress = 0
                              webView?.reload() 
                          }) {
                              Icon(
                                  imageVector = Icons.Default.Refresh,
                                  contentDescription = "Refresh",
                                  tint = Color(0xFF22D3EE)
                              )
                          }
                          IconButton(onClick = { showSettingsDialog = true }) {
                              Icon(
                                  imageVector = Icons.Default.Settings,
                                  contentDescription = "Settings",
                                  tint = Color(0xFF8B5CF6)
                              )
                          }
                      },
                      colors = TopAppBarDefaults.topAppBarColors(
                          containerColor = Color(0xFF080710),
                          titleContentColor = Color.White
                      )
                  )
              }
          ) { innerPadding ->
              Box(
                  modifier = Modifier
                      .fillMaxSize()
                      .padding(innerPadding)
                      .background(Color(0xFF030014))
              ) {
                  if (hasError) {
                      OfflineScreen(onRetry = {
                          hasError = false
                          loadingProgress = 0
                          webView?.reload()
                      })
                  } else {
                      AndroidView(
                          modifier = Modifier.fillMaxSize(),
                          factory = { ctx ->
                              WebView(ctx).apply {
                                  layoutParams = ViewGroup.LayoutParams(
                                      ViewGroup.LayoutParams.MATCH_PARENT,
                                      ViewGroup.LayoutParams.MATCH_PARENT
                                  )
                                  
                                  settings.javaScriptEnabled = true
                                  settings.domStorageEnabled = true
                                  settings.databaseEnabled = true
                                  settings.cacheMode = WebSettings.LOAD_DEFAULT
                                  settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                                  
                                  webViewClient = object : WebViewClient() {
                                      override fun onReceivedError(
                                          view: WebView?,
                                          request: WebResourceRequest?,
                                          error: WebResourceError?
                                      ) {
                                          if (request?.isForMainFrame == true) {
                                              hasError = true
                                          }
                                      }

                                      override fun doUpdateVisitedHistory(
                                          view: WebView?,
                                          url: String?,
                                          isReload: Boolean
                                      ) {
                                          super.doUpdateVisitedHistory(view, url, isReload)
                                          canGoBack = view?.canGoBack() ?: false
                                          canGoForward = view?.canGoForward() ?: false
                                      }
                                  }
                                  
                                  webChromeClient = object : WebChromeClient() {
                                      override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                          loadingProgress = newProgress
                                      }
                                  }
                                  
                                  loadUrl(serverUrl)
                                  webView = this
                              }
                          },
                          update = {
                              // Re-trigger load if Server URL state changes
                              if (it.url != serverUrl && !serverUrl.isNullOrEmpty()) {
                                  it.loadUrl(serverUrl)
                              }
                              webView = it
                          }
                      )

                      if (loadingProgress < 100) {
                          LinearProgressIndicator(
                              progress = { loadingProgress / 100f },
                              color = Color(0xFF22D3EE),
                              trackColor = Color.Transparent,
                              modifier = Modifier
                                  .fillMaxWidth()
                                  .height(3.dp)
                                  .align(Alignment.TopStart)
                          )
                      }
                  }

                  // Settings Server Dialog
                  if (showSettingsDialog) {
                      var inputUrl by remember { mutableStateOf(serverUrl) }
                      AlertDialog(
                          onDismissRequest = { showSettingsDialog = false },
                          title = { Text(text = "Cài đặt máy chủ") },
                          text = {
                              Column {
                                  Text(
                                      text = "Nhập địa chỉ máy chủ Sensei Hub (ví dụ: http://10.0.2.2:3000 hoặc staging domain):",
                                      fontSize = 12.sp,
                                      color = Color.LightGray,
                                      modifier = Modifier.padding(bottom = 8.dp)
                                  )
                                  OutlinedTextField(
                                      value = inputUrl,
                                      onValueChange = { inputUrl = it },
                                      label = { Text("Server URL") },
                                      singleLine = true,
                                      modifier = Modifier.fillMaxWidth()
                                  )
                              }
                          },
                          confirmButton = {
                              Button(
                                  onClick = {
                                      if (inputUrl.startsWith("http://") || inputUrl.startsWith("https://")) {
                                          serverUrl = inputUrl
                                          sharedPreferences.edit().putString(KEY_SERVER_URL, inputUrl).apply()
                                          showSettingsDialog = false
                                          hasError = false
                                          loadingProgress = 0
                                          webView?.loadUrl(inputUrl)
                                      }
                                  }
                              ) {
                                  Text("Lưu & Kết nối")
                              }
                          },
                          dismissButton = {
                              TextButton(onClick = { showSettingsDialog = false }) {
                                  Text("Hủy")
                              }
                          }
                      )
                  }
              }
          }
      }
  }
  ```

- [ ] **Step 2: Rebuild Android App to verify compilation**
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-android && ./gradlew assembleDebug"`
  Expected: BUILD SUCCESSFUL. Output APK generated at `sensei-hub-android/app/build/outputs/apk/debug/app-debug.apk`.

- [ ] **Step 3: Commit**
  ```bash
  git add sensei-hub-android/app/src/main/java/com/example/senseihub/ui/main/MainScreen.kt
  git commit -m "android: add native navigation toolbar, settings dialog, and server url persistence"
  ```
