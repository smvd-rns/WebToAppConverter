# WebToApp Converter Engine

This project turns any website into a native Android App (APK/AAB) and Windows App (EXE).

## 📂 Project Structure
*   `android-template/`: The native Android project files.
*   `windows-template/`: The native Windows project files.
*   `.github/workflows/`: The automation script that does the building.
*   `frontend/`: **Deploy this to Vercel**. The beautiful website users see.
*   `backend/`: **Deploy this to Render**. The API that talks to GitHub.

---

## 🚀 Deployment Guide (How to put it online)

You have one Git Repository, but you will connect it to **two** different services.

### Part 1: Deploy the Backend (Render)
1.  Go to [Render.com](https://render.com) and create a **Web Service**.
2.  Connect this GitHub repository.
3.  **Crucial Step**: In the settings, look for **Root Directory**.
    *   Set Root Directory to: `backend`
4.  **Enviroment Variables** (Add these in Render settings):
    *   `GITHUB_TOKEN`: Your Personal Access Token (Settings -> Developer Settings -> Personal Access Tokens).
    *   `REPO_OWNER`: Your GitHub username.
    *   `REPO_NAME`: The name of this repository.
5.  Click **Deploy**. Copy the URL Render gives you (e.g., `https://my-backend.onrender.com`).

### Part 2: Deploy the Frontend (Vercel)
1.  Go to [Vercel.com](https://vercel.com) and Add New > Project.
2.  Import this same GitHub repository.
3.  **Crucial Step**: It will ask "Framework Preset". It should detect Next.js automatically.
4.  Look for **Root Directory** (Edit button).
    *   Select the `frontend` folder.
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Paste your Render Backend URL here (e.g., `https://my-backend.onrender.com/api` - don't forget the `/api` at the end!).
6.  Click **Deploy**.

---

## 🛠️ How it works
1.  User goes to your **Vercel Website**.
2.  User types a URL.
3.  **Vercel** talks to **Render**.
4.  **Render** commands **GitHub Actions** to start building.
5.  **GitHub Actions** builds the APK/EXE and releases them.
6.  The Website shows the user the download link!

---

## 🛑 Important Notes
*   **Android Signing**: The APK generated is signed with a "Debug Key". It allows you to install it on phones, but the Play Store requires a "Release Key". To adding real signing, you would need to add `storeFile` secrets to the workflow.
*   **Icon Quality**: Ensure your Icon URL points to a high-quality square PNG (at least 512x512) for best results.
