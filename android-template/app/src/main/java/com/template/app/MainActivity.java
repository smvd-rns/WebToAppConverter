package com.template.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Create WebView dynamically to save XML resource overhead
        WebView webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        // Keep navigation inside the webview
        webView.setWebViewClient(new WebViewClient());

        // LOAD_URL_PLACEHOLDER
        webView.loadUrl("https://google.com");
    }
    
    @Override
    public void onBackPressed() {
        // Handle back button to navigate history instead of closing app
        WebView webView = (WebView) findViewById(android.R.id.content);
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
