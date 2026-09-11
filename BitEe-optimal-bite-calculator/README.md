# BitEe 🍔 — The Optimal Bite Calculator

> *"Engineering the perfect bite, because apparently eating a sandwich wasn't complicated enough."*

A hilarious, satirical hackathon web application that treats sandwich and burger construction as an aerospace engineering optimization problem.

---

## 🚀 Instant Deployment Guide (Vercel + Supabase)

### Step 1: Set Up Supabase Cloud Database (Free & Fast)

1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. In the Supabase Dashboard, open the **SQL Editor** from the left sidebar.
3. Open `supabase_schema.sql` in this repo, copy its contents, paste it into the SQL Editor, and click **Run**.
4. Go to **Project Settings** → **API** and copy:
   - **Project URL** (`https://your-project.supabase.co`)
   - **Anon Public API Key** (`eyJhbGci...`)

---

### Step 2: Deploy to Vercel (1-Click)

#### Option A: Deploy via GitHub (Recommended)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: BitEe Optimal Bite Calculator v2.6"
   git branch -M main
   git remote add origin https://github.com/your-username/bitee-optimal-bite-calculator.git
   git push -u origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and click **"Add New" → "Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
5. Click **Deploy**! In ~15 seconds, your site will be live at `https://your-project.vercel.app`.

#### Option B: Deploy using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy directly from this directory
vercel
```

---

### Step 3: Configure In-App (No Redeployment Needed)
You can also connect or test your Supabase database directly within the running web app:
- Click the **⚡ Supabase** button in the top navigation bar.
- Enter your Supabase Project URL and Anon Key.
- Click **Save Connection** — everything is instantly synchronized!

---

## 🌟 Key Features

- **Layer-by-Layer Airframe Configurator**: Real-time scale cross-section rendering in high-performance SVG.
- **5-Axis Flavor Balance Radar Chart**: Target ideal strata ratios vs actual composition.
- **Audio Telemetry Synthesizer**: Retro 8-bit aerospace beeps, ratio exceed warning chimes, critical stall sirens, and victory fanfare.
- **Voice Announcement Engine**: Celebrates with `"Wow! Bite is ready, kadichoo!"` upon achieving flavor optimization.
- **Public Airframe Hangar**: Share sandwiches globally to Supabase, browse community creations, and upvote community builds.
- **Official Bite Certificate Generator**: Canvas-rendered, high-resolution downloadable PNG certification.
- **Theatrical Hackathon Stage Demo Mode**: Theatrical calibration sequence for presentations.
- **Aerodynamic Flight Mode**: Dynamic aerospace HUD terminology switch.

---

## 🛠️ Tech Stack

- **Client**: Vanilla JavaScript (ES Modules), HTML5, Tailwind CSS, SVG Graphics Canvas, Web Audio API, Web Speech API
- **Database / Backend**: Supabase (PostgreSQL with Row Level Security)
- **Deployment & Hosting**: Vercel Edge Network (`vercel.json`)
