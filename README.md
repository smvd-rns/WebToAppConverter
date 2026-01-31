# WebToApp Converter Engine

This project contains a complete automation system to turn any website into a native Android App (APK/AAB) and Windows App (EXE) using GitHub Actions.

## Project Structure
*   `android-template/`: The native Android project files (Java/Gradle).
*   `windows-template/`: The native Windows project files (Rust/Tauri).
*   `.github/workflows/build-app.yml`: The automation script.

## 🚀 How to set this up

### Step 1: Upload to GitHub
1.  Create a new **Private Repository** on GitHub.
2.  Push all the files in this folder to that repository.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    git push -u origin main
    ```

### Step 2: Enable Permissions
1.  Go to your Repository Settings on GitHub.
2.  Go to **Actions** -> **General**.
3.  Scroll to "Workflow permissions".
4.  Select **"Read and write permissions"**. (This is required to upload the Release files).
5.  Click **Save**.

### Step 3: Run the Build
1.  Go to the **Actions** tab in your repository.
2.  On the left, click **"Build App"**.
3.  On the right, click the **"Run workflow"** dropdown button.
4.  Fill in the form:
    *   **App Name**: e.g., "My Shop"
    *   **App URL**: e.g., "https://myshop.com"
    *   **Icon URL**: e.g., "https://myshop.com/logo.png" (Must be a direct link to a PNG)
    *   **App ID**: e.g., "com.myshop.app"
5.  Click **Run workflow**.

### Step 4: Download Your App
1.  Wait about 5-8 minutes for the build to finish.
2.  Go to the **Code** tab (main page).
3.  Look at the right sidebar under **"Releases"**.
4.  You will see a new release (e.g., `App Build - My Shop`).
5.  Click it to download your `.apk`, `.aab`, and `.exe` files.

## 🛑 Important Notes
*   **Android Signing**: The APK generated is signed with a "Debug Key". It allows you to install it on phones, but the Play Store requires a "Release Key". To adding real signing, you would need to add `storeFile` secrets to the workflow.
*   **Icon Quality**: Ensure your Icon URL points to a high-quality square PNG (at least 512x512) for best results.
