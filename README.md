# 🎓 GateMaster - AI-Powered GATE CSE Studio

A comprehensive, state-of-the-art study management application engineered specifically for GATE CSE preparation. It features highly advanced AI-driven dynamic schedule optimizations, a proprietary **311-day comprehensive curriculum**, smart performance analytics, and a late-night aware adaptive distribution system.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan) ![Zustand](https://img.shields.io/badge/Zustand-State-orange) ![Supabase](https://img.shields.io/badge/Supabase-Auth-green) ![Gemini](https://img.shields.io/badge/Google-Gemini_AI-blue)

## 🌟 Key Architecture & Features

### 📅 The 311-Day Master Syllabus
- **Complete Roadmap**: Spanning ~10.5 months to strategically cover every corner of the GATE CSE syllabus.
- **Phased Architecture**: Built across Ramping, Core Deep-Dives, Test Series, and Final Optimization waves.
- **Micro-Targeted Sessions**: Daily distributions encompassing Primary Subject Lectures, PYQ Problem Solving, Engineering Mathematics matrices, and Active Reflection records.

### 🧠 Gemini AI Schedule Engine & Catch-up Distribution
- **Gemini Overrides**: Dynamically restructures your daily agenda based on deep syllabus analytics and custom prompts.
- **Intelligent Backlog Engine**: Never skip a beat. Missed days (red alerts) securely carry over incomplete tasks, intelligently spreading them across upcoming days to maintain momentum without crushing your schedule.
- **Late-Night Boundary Aware**: Study till you drop. The internal engine natively recognizes a **5:00 AM Day Rest** parameter—sessions logged at 3:00 AM correctly attribute to the previous calendar study cycle automatically.

### 🔐 Supabase Google OAuth
- Deep integration with **Supabase Authentication**.
- Flawless, frictionless one-click Google Sign-in to keep personal configurations securely synchronized online.

### 📊 Subject-wise Mastery & Analytics UI
- **Multi-Expand Dynamic Grid**: Hardware-accelerated fluid CSS-grid topic explorers. Examine your specific conceptual progress with granular mastery levels.
- **SVG Circular Matrix**: Beautifully rendered dashboard widgets visually representing topic and PYQ accuracy completions at a glance in real-time.
- **Projected Readiness Score**: Computed analytics combining volume data, historical PYQ accuracy, and time allocation maps to gauge active gate readiness.

### ⏱️ Custom Pomodoro Ecosystem
- **Focus Workflows**: Choose between scientifically-backed modes (25/5, 50/10, 90/20) or fully custom timers.
- **Auto-Sync Capabilities**: Timer finishes dynamically link to and complete your agenda tasks instantaneously.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A `.env` file containing your Supabase and Gemini API credentials:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEMINI_API_KEY`

### Installation

1. **Clone the project repository**
```bash
git clone https://github.com/Ishika1323/Gate-Master.git
cd "Gate App"
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the local development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 🛠️ Project Stack

- **Frontend Core**: React 18 / Vite
- **Global State Management**: Zustand
- **Authentication**: Supabase Auth
- **Routing**: React Router v6
- **Styling**: Tailwind CSS (Fully fluid responsive layouts)
- **AI Processing**: Google Gemini API Integration
- **Chronology Tools**: Contextual date boundaries & Local Time preservation
- **Icons**: Lucide React

## 🎓 Best Practices For Maximum Output

1. **Leverage the 5 AM rule:** Take the liberty to study at 1 AM. The app intelligently logs those hours towards the day you mentally intended.
2. **Consult the AI Agenda Generator:** If your syllabus requires micro-detailing, active AI Mode in the dashboard to let Gemini reshape your load based on complex prerequisites.
3. **Use the Dashboard Grids:** Monitor your "Subject-wise Mastery". Those charts dictate where your mathematical weaknesses currently lie mathematically.
4. **Don't wipe past missed days:** Let the intelligent Engine carry them properly. They will be marked **RED**, warning you of inefficiencies, but they will be seamlessly distributed into the future automatically to safeguard your progression. 

## 📝 License & Contribution

This is an actively evolving open-source study operating platform. Contributions, forks, and feature issues are heavily welcomed to enhance GATE preparation logic across the framework. 

*Prepare optimally. Ace GATE 2027.* 🎯
