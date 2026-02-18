# 🎓 AI-Powered Study Planner - GATE CSE Preparation

A comprehensive study management application designed specifically for GATE CSE and BARC exam preparation. Features AI-driven recommendations, adaptive learning, Pomodoro timer, PYQ tracking, and a structured 32-day study plan from Feb 18 to March 20, 2026.

![Study Planner](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan) ![Zustand](https://img.shields.io/badge/Zustand-State-orange)

## 🌟 Key Features

### 📚 32-Day Structured Study Plan
- **Pre-loaded study schedule** with 4 daily sessions (3hr, 3hr, 2.5hr, 1.5hr)
- **Subject rotation** covering DS, Algorithms, OS, DBMS, CN, COA, Digital Logic, TOC, Compiler
- **Built-in revision loops** every 2 days
- **Fixed daily blocks**: 3hr Engineering Mathematics + 1hr Aptitude (30min general + 30min job)
- **Progressive intensity** with lighter days before exam

### ⏱️ Pomodoro Timer System
- **4 timer modes**: 25/5, 50/10, 90/20, Custom
- **Subject auto-tagging** for each session
- **Focus hours tracking** per subject
- **Circular progress visualization**
- **Auto-session saving** to analytics

### 🤖 AI-Powered Features

#### AI Coach
- **Daily personalized tips** based on performance
- **Study phase recommendations** (Foundation → Practice → Revision → Final Polish)
- **Strategic advice** on what to study and what to avoid
- **Burnout detection** with lighter day suggestions
- **Motivational feedback** based on progress

#### AI Task Suggester
- **Intelligent task prioritization** analyzing:
  - Reattempt flags
  - Low accuracy subjects
  - Priority levels
  - Exam weight
  - Time estimates
- **Visual task highlighting** with reasoning
- **Top 3 recommendations** displayed prominently

#### Adaptive Learning Engine
- **Performance-based adjustments**: <60% accuracy → repair session, >80% → harder content
- **Readiness score calculation** (0-100) based on study hours, PYQ accuracy, task completion
- **Weak area identification** with specific recommendations
- **Auto-rescheduling** of missed sessions

### ✅ Advanced Task Management
- **Rich task metadata**: subject, topic, priority, estimated time, exam weight, type, reattempt flag
- **Smart filtering**: all, active, completed, PYQ, revision, reattempt
- **Sorting options**: priority, time, subject
- **AI-suggested tasks** section at top of list

### 📝 PYQ Training & Tracking
- **Easy PYQ logging**: subject, year, questions, correct answers, time taken
- **Accuracy tracking** with color-coded performance
- **Mistake notebook** (auto-generated)
- **Forced reattempt** reminders after 2 days
- **Subject-wise performance analysis**

### 📊 Analytics Dashboard
- **Study hours** by subject (bar chart)
- **PYQ accuracy trend** over time (line chart)
- **Subject-wise accuracy** comparison (bar chart)
- **Progress metrics**: days until exam, total hours, tasks completed, readiness score
- **Weak topic alerts**

### 🎨 UI/UX Features
- **Dark/Light mode** with smooth transitions
- **Subject color coding** for visual organization
- **Mobile-responsive** design with bottom navigation
- **Empty states** and loading indicators
- **Premium gradient cards** for stats
- **Smooth animations** and hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone or navigate to the project directory**
```bash
cd "d:\Gate App"
```

2. **Install dependencies** (already done)
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
d:/Gate App/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   └── ProgressDashboard.jsx    # Main dashboard with AI coach
│   │   ├── Timer/
│   │   │   └── PomodoroTimer.jsx        # Pomodoro timer with 4 modes
│   │   ├── Tasks/
│   │   │   ├── TasksPage.jsx            # Task management hub
│   │   │   ├── TaskList.jsx             # AI-suggested tasks display
│   │   │   ├── TaskCard.jsx             # Rich task card with metadata
│   │   │   └── TaskForm.jsx             # Comprehensive task form
│   │   ├── PYQ/
│   │   │   └── PYQPage.jsx              # PYQ logging and tracking
│   │   ├── Analytics/
│   │   │   └── AnalyticsPage.jsx        # Charts and visualizations
│   │   ├── StudyPlan/
│   │   │   └── StudyPlanPage.jsx        # 32-day plan view
│   │   ├── Layout/
│   │   │   └── Navbar.jsx               # Navigation with theme toggle
│   │   └── UI/
│   │       ├── Button.jsx               # Reusable button
│   │       ├── Card.jsx                 # Container component
│   │       ├── Badge.jsx                # Label component
│   │       └── Modal.jsx                # Modal dialog
│   ├── ai/
│   │   ├── aiCoach.js                   # Daily tips & recommendations
│   │   ├── taskSuggester.js             # Intelligent task prioritization
│   │   └── adaptiveEngine.js            # Performance-based adjustments
│   ├── store/
│   │   └── useAppStore.js               # Zustand state management
│   ├── data/
│   │   ├── subjects.js                  # Subject definitions
│   │   └── studyPlan.js                 # 32-day schedule
│   ├── utils/
│   │   ├── timerUtils.js                # Timer helpers
│   │   └── dateUtils.js                 # Date calculations
│   ├── styles/
│   │   └── index.css                    # Global styles + Tailwind
│   ├── App.jsx                          # Main app with routing
│   └── main.jsx                         # React entry point
├── index.html
├── tailwind.config.js                   # Custom theme config
├── postcss.config.js
├── vite.config.js
└── package.json
```

## 🎯 How to Use

### 1. **Dashboard** (Landing Page)
- View **key metrics**: days until exam, study hours, tasks done, readiness score
- Read **AI coach daily tip** with personalized recommendations
- See **AI-suggested tasks** with reasoning
- Check **weak areas** needing attention
- Access **quick actions** buttons

### 2. **Timer** (Pomodoro Focus Sessions)
- Select timer mode: 25/5, 50/10, 90/20, or custom
- Choose subject you're studying
- Start/pause/reset timer
- Sessions auto-save to analytics

### 3. **Tasks** (To-Do Management)
- Click **"Add Task"** to create new task
- Fill in: title, subject, topic, priority, estimated time, exam weight, type
- Check **"Reattempt Required"** for weak areas
- Filter by: all, active, completed, PYQ, revision, reattempt
- Sort by: priority, time, subject
- **AI recommendations** appear at top

### 4. **PYQ** (Practice Question Tracking)
- Click **"Log PYQ"** after completing practice
- Enter: subject, year, total questions, correct answers, time taken
- View accuracy with color coding (green >80%, yellow 60-80%, red <60%)
- Track progress over time

### 5. **Analytics** (Performance Insights)
- **Study hours by subject** - bar chart
- **PYQ accuracy trend** - line chart showing improvement
- **Subject-wise accuracy** - identify strong/weak areas

### 6. **Study Plan** (32-Day Schedule)
- Navigate through days using arrows
- View 4 sessions per day with subjects and topics
- Mark sessions as complete
- See full 32-day calendar overview
- Track completion progress

## 🧠 AI Logic Explained

### Task Suggestion Scoring
Tasks are scored based on:
- **Reattempt flag**: +100 points (highest priority)
- **High priority**: +50 points
- **High exam weight**: +40 points
- **Low subject accuracy (<60%)**: +60 points
- **PYQ type**: +30 points
- **Quick tasks (<45 min)**: +10 points

### Adaptive Learning
- **Accuracy < 60%**: Adds repair session for concept review
- **Accuracy > 80%**: Suggests harder problems and advanced topics
- **Missed sessions**: Auto-reschedules over next few days
- **Burnout detection**: Analyzes session patterns, suggests breaks

### Readiness Score (0-100)
- **Study hours** (30 points): Based on expected 10 hrs/day
- **PYQ accuracy** (35 points): Overall correctness percentage
- **Task completion** (20 points): Completed vs total tasks
- **Mistake reattempts** (15 points): Learning from errors

## 🎨 Customization

### Theme
Toggle dark/light mode using the sun/moon icon in the navbar.

### Timer Modes
Customize work/break durations in the timer settings.

### Study Plan
The 32-day plan is pre-loaded but adjusts based on your performance through the adaptive engine.

## 💾 Data Persistence

All data is stored in **browser LocalStorage**:
- Tasks and completion status
- PYQ attempts and accuracy history
- Study sessions and focus hours
- Mistake notebook
- User settings

**Note**: Clearing browser data will reset the app.

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS with custom theme
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📅 Study Plan Highlights

| Phase | Days | Focus |
|-------|------|-------|
| **Foundation** | 1-10 | Core subjects (DS, Algo, OS, DBMS, CN) |
| **Intensive Practice** | 11-20 | PYQ solving, speed building |
| **Revision & Consolidation** | 21-28 | Full subject revision, mock tests |
| **Final Polish** | 29-32 | Light revision, confidence building |

- **Day 28**: Full mock test + analysis
- **Day 31**: Minimal study, mental preparation
- **Day 32**: Exam day (March 21)

## 🔐 Privacy

All data stays **100% local** in your browser. No external servers, no tracking, no data collection.

## 🤝 Contributing

This is a personal study planner. Feel free to fork and customize for your own exam preparation!

## 📝 License

MIT License - Feel free to use and modify for your studies.

## 🎓 Best Practices

1. **Be honest with logging** - Accurate data = Better AI suggestions
2. **Follow the AI coach tips** - They adapt to your performance
3. **Don't skip reattempt tasks** - Weak areas need attention
4. **Use the timer daily** - Builds focus discipline
5. **Review analytics weekly** - Track improvement trends
6. **Trust the 32-day plan** - It's designed for progressive learning
7. **Take breaks** - The timer enforces this for a reason

## 🚀 Ready to Ace GATE CSE!

Start your preparation journey with AI-powered guidance. The app learns from your study patterns and helps you optimize your limited time before the exam.

**Good luck! 🎯**
