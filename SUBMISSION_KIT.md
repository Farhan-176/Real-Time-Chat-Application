# EncoderX Task 4 — Submission Kit & Action Plan

This document contains everything you need to finalize and submit **Task 4: Real-Time Chat Application** today.

---

## 📌 Checklist of What Needs to Be Done by You Today

| Item | Status | Action Required |
| :--- | :---: | :--- |
| **1. Codebase Implementation** | ✅ **COMPLETE** | Fully implemented, tested, and builds cleanly (`npm run build`). |
| **2. Architecture & Pipeline Docs** | ✅ **COMPLETE** | Documented with Mermaid diagrams in `README.md` & `server/schema.sql`. |
| **3. Git Repository** | 🟡 **ACTION NEEDED** | Push the local repository to a **public GitHub repository**. |
| **4. Cloud Deployment** | 🟡 **ACTION NEEDED** | Deploy to Render / Railway and copy the **live URL**. |
| **5. 3–5 Min Demonstration Video** | 🟡 **ACTION NEEDED** | Record a screen capture walkthrough using the provided script below. |
| **6. LinkedIn Post** | 🟡 **ACTION NEEDED** | Publish on LinkedIn tagging **EncoderX** with mandatory hashtags. |
| **7. Final Submission PDF** | 🟡 **ACTION NEEDED** | Combine the 3 links into the submission PDF and submit to the portal. |

---

## 🛠 Step 1: Push Code to GitHub

Open your terminal in this directory and run:

```bash
git add .
git commit -m "feat: complete Task 4 real-time chat application with Socket.IO, JWT auth, and persistence"
git branch -M main
```

Next, create a new **public** repository on your GitHub account (named e.g. `encoderx-realtime-chat-app`) and run:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

## 🚀 Step 2: Deploy to Production (100% Free Alternatives, No Credit Card Required)

Since Render no longer supports a free tier without card verification, use any of these completely free, WebSocket-ready platforms:

### Option A: Koyeb (Recommended — Fastest & Professional)
1. Go to [https://www.koyeb.com](https://www.koyeb.com) and sign up with GitHub (No credit card needed).
2. Click **Create Service** and select **GitHub**.
3. Select your repository: `Farhan-176/Real-Time-Chat-Application`.
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Run Command:** `npm start`
   - **Port:** `3001`
   - **Environment Variable:** `JWT_SECRET` = `(generate any 32-character random string)`
5. Click **Deploy**. Koyeb gives you an instant HTTPS/WSS URL: `https://<your-app-name>.koyeb.app`.

### Option B: Glitch (1-Click Instant Import)
1. Go to [https://glitch.com](https://glitch.com) and log in with GitHub.
2. Click **New Project** → **Import from GitHub**.
3. Paste: `https://github.com/Farhan-176/Real-Time-Chat-Application.git`.
4. Glitch deploys your app instantly with a public `https://<project-name>.glitch.me` URL.

### Option C: Replit (Instant Free Run)
1. Go to [https://replit.com](https://replit.com) → **Create Repl** → **Import from GitHub**.
2. Select `Farhan-176/Real-Time-Chat-Application`.
3. In the shell run `npm install && npm run build && npm start`.
4. Copy your public webview URL (`https://<repl-name>.<username>.replit.app`).

---

## 🎥 Step 3: Record the 3–5 Minute Demo Video

Use [Loom](https://www.loom.com/), OBS Studio, or Windows Game Bar (`Win + G`) to record your screen and microphone.

### Recommended Video Flow (3–4 minutes):
1. **Introduction (30s):**
   - Introduce yourself: *"Hi, I am Farhan, full-stack intern at EncoderX (Batch 02). Today I am presenting Task 4: Real-Time Chat Application."*
   - Mention the tech stack: React, TypeScript, Vite, Node.js, Express, Socket.IO, JWT authentication, and room-based WebSocket routing.
2. **Live Dual-User Demonstration (2 minutes):**
   - Open **two browser windows side by side** (e.g., normal window for Maya Chen, incognito for Jordan Lee).
   - Show the sign-in screen and log in with both accounts.
   - Show the **online presence badge** turning green immediately.
   - Show **live typing indicators**: start typing in Maya's window and point out the animated typing bubble in Jordan's window.
   - Send messages back and forth: show that messages appear instantly in real-time **without page reloads**.
   - Show message persistence: refresh one of the browser windows and show that the entire chat history persists from storage.
   - Show disconnection lifecycle: close Jordan's tab and show Maya's sidebar updating Jordan's status to **offline**.
3. **Architecture & Code Walkthrough (1 minute):**
   - Quickly showcase the code in VS Code / IDE:
     - `server/index.js`: show the JWT handshake verification (`io.use`), the user-to-socket ID mapping, and `room:join` segregated rooms.
     - `src/App.tsx`: show the persistent WebSocket connection, state synchronization, and UI components.
     - `server/schema.sql`: show the relational schema for archiving chat histories.
4. **Closing (15s):**
   - Mention successful production deployment on Render and thank EncoderX.

---

## 💼 Step 4: Publish LinkedIn Post

Copy and paste this post to your LinkedIn profile. Remember to **tag EncoderX** and verify that all hashtags are included!

```text
🚀 Thrilled to share my latest project completed for the EncoderX Remote Internship (Batch 02) — Task 4: Real-Time Chat Application!

I built "Relay Room", a production-ready, full-stack real-time collaboration app transitioning standard HTTP request-response patterns into persistent, event-driven WebSocket architectures.

🔑 Key Architectural Features:
• Security & Auth: JWT token authentication integrated directly into the Socket.IO connection handshake.
• User-to-Socket Mapping: Clean internal mapping of authenticated users to unique socket IDs for reliable presence tracking.
• Channel Rooms: Segregated two-user communication circles utilizing deterministic room structures (socket.join).
• Real-Time State Sync: Instant message dispatching without page reloads, live typing indicators, and presence updates.
• Message Persistence: Structured data schema archiving chat histories, sender/receiver metadata, and timestamps.
• Deployment: Unified production build running on Node.js and deployed to Render.

🛠 Tech Stack: React, TypeScript, Vite, Node.js, Express, Socket.IO, JWT.

🔗 Live Demo: [PASTE YOUR RENDER URL HERE]
💻 GitHub Code: [PASTE YOUR GITHUB REPO URL HERE]
🎥 Video Walkthrough: [PASTE YOUR DEMO VIDEO LINK HERE]

Grateful to @EncoderX for the opportunity to build industry-standard full stack systems!

#EncoderX #FullStackDevelopment #WebDevelopment #WebSockets #RealTime #Internship #LearningInPublic
```

---

## 📄 Step 5: Submission PDF Template

The portal requires:
> *"Submit the GitHub Repository Link, LinkedIn Post Link, and Video Link in a single PDF through the assigned submission portal."*

We have created [`SUBMISSION_DOCUMENT.html`](file:///e:/ongoing%20projects/REAL-TIME%20CHAT%20APPLICATION%20INTERN%20TASK/SUBMISSION_DOCUMENT.html) in this project folder.
You can open it in Chrome / Edge, fill in your 3 links, press `Ctrl + P`, and select **Save as PDF**!
