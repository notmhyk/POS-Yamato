import os
import shutil

def generate_project():
    base_dir = r"c:\Users\ADMIN MHYK\Desktop\JAI"
    proj_dir = os.path.join(base_dir, "android_project")
    app_dir = os.path.join(proj_dir, "app")
    main_dir = os.path.join(app_dir, "src", "main")
    java_dir = os.path.join(main_dir, "java", "com", "yamato", "pos")
    assets_dir = os.path.join(main_dir, "assets")
    res_dir = os.path.join(main_dir, "res")
    layout_dir = os.path.join(res_dir, "layout")
    values_dir = os.path.join(res_dir, "values")

    os.makedirs(java_dir, exist_ok=True)
    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(layout_dir, exist_ok=True)
    os.makedirs(values_dir, exist_ok=True)

    # 1. Copy web assets into android_asset
    for item in ['index.html', 'style.css', 'app.js', 'manifest.json']:
        src = os.path.join(base_dir, item)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(assets_dir, item))

    assets_src = os.path.join(base_dir, 'assets')
    assets_dest = os.path.join(assets_dir, 'assets')
    if os.path.exists(assets_dest):
        shutil.rmtree(assets_dest)
    if os.path.exists(assets_src):
        shutil.copytree(assets_src, assets_dest)

    # 2. MainActivity.java
    main_activity_content = '''package com.yamato.pos;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep screen on for POS terminal
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Set Fullscreen immersive mode
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);

        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.posWebView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        // Load self-contained local POS files directly from APK
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
'''
    with open(os.path.join(java_dir, "MainActivity.java"), "w", encoding="utf-8") as f:
        f.write(main_activity_content)

    # 3. activity_main.xml
    activity_main_xml = '''<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0E0D12">

    <WebView
        android:id="@+id/posWebView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</FrameLayout>
'''
    with open(os.path.join(layout_dir, "activity_main.xml"), "w", encoding="utf-8") as f:
        f.write(activity_main_xml)

    # 4. AndroidManifest.xml
    manifest_xml = '''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yamato.pos">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@android:drawable/sym_def_app_icon"
        android:label="Yamato POS"
        android:hardwareAccelerated="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:screenOrientation="sensorLandscape">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
'''
    with open(os.path.join(main_dir, "AndroidManifest.xml"), "w", encoding="utf-8") as f:
        f.write(manifest_xml)

    # 5. build.gradle
    build_gradle = '''plugins {
    id 'com.android.application'
}

android {
    namespace 'com.yamato.pos'
    compileSdk 34

    defaultConfig {
        applicationId "com.yamato.pos"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
}
'''
    with open(os.path.join(app_dir, "build.gradle"), "w", encoding="utf-8") as f:
        f.write(build_gradle)

    print(f"Android Project generated successfully at: {proj_dir}")

if __name__ == '__main__':
    generate_project()
