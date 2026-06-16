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
        delay(1200) // Shorter delay
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

        // Shared back navigation handler
        val navigateBack = {
            if (hasError) {
                hasError = false
                loadingProgress = 0
            }
            webView?.goBack()
        }

        BackHandler(enabled = canGoBack || hasError) {
            if (hasError) {
                hasError = false
                loadingProgress = 0
                webView?.reload()
            } else {
                navigateBack()
            }
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
                            onClick = { navigateBack() },
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
                    key(serverUrl) {
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
                                    settings.cacheMode = WebSettings.LOAD_DEFAULT
                                    settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                                    
                                    webViewClient = object : WebViewClient() {
                                        override fun shouldOverrideUrlLoading(
                                            view: WebView?,
                                            request: WebResourceRequest?
                                        ): Boolean {
                                            val url = request?.url?.toString() ?: return false
                                            if (!url.startsWith(serverUrl)) {
                                                try {
                                                    val intent = android.content.Intent(
                                                        android.content.Intent.ACTION_VIEW,
                                                        android.net.Uri.parse(url)
                                                    )
                                                    view?.context?.startActivity(intent)
                                                    return true
                                                } catch (e: Exception) {
                                                    e.printStackTrace()
                                                }
                                            }
                                            return false
                                        }

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
                                webView = it
                            },
                            onRelease = {
                                it.destroy()
                                webView = null
                            }
                        )
                    }

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
                    var isError by remember { mutableStateOf(false) }
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
                                    onValueChange = { 
                                        inputUrl = it 
                                        isError = false
                                    },
                                    label = { Text("Server URL") },
                                    singleLine = true,
                                    isError = isError,
                                    supportingText = {
                                        if (isError) {
                                            Text(
                                                text = "Địa chỉ URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)",
                                                color = MaterialTheme.colorScheme.error
                                            )
                                        }
                                    },
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                        },
                        confirmButton = {
                            Button(
                                onClick = {
                                    val trimmed = inputUrl.trim()
                                    if (android.webkit.URLUtil.isValidUrl(trimmed) && 
                                        (trimmed.startsWith("http://") || trimmed.startsWith("https://"))) {
                                        serverUrl = trimmed
                                        sharedPreferences.edit().putString(KEY_SERVER_URL, trimmed).apply()
                                        showSettingsDialog = false
                                        hasError = false
                                        loadingProgress = 0
                                    } else {
                                        isError = true
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
