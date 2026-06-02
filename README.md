<![CDATA[# 🏏 Aki-Cricket — AI-Powered IPL Guessing Game

<p align="center">
  <strong>"Think of any IPL cricketer. I'll guess who it is in 20 questions."</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-r169-green?logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/MongoDB-8.x-darkgreen?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Framer%20Motion-11-purple?logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
</p>

---

## 📖 About

**Aki-Cricket** is an Akinator-style AI guessing game built specifically for IPL (Indian Premier League) cricket players. The AI asks up to **20 strategic yes/no questions** and uses **Shannon entropy-based information gain** to narrow down from a pool of **150+ IPL players** — legends, stars, regulars, and fringe players alike.

The game features a stunning **neon-cyberpunk UI**, immersive **Three.js 3D visuals**, dynamic **AI persona reactions**, and a silky-smooth experience powered by **Framer Motion** animations.

---

## ✨ Features

### 🧠 Intelligent AI Engine
- **Shannon Entropy Algorithm** — Each question is selected to maximize information gain, splitting the candidate pool as close to 50/50 as possible.
- **Weighted Scoring System** — Nuanced answer weighting (`yes` = +1.0, `no` = +1.0, `maybe` = +0.5, `don't know` = neutral).
- **Question Invalidation** — Answering "yes" to "Is the player a batsman?" automatically skips irrelevant bowling questions.
- **Category Priority Weights** — Early questions favor high-impact categories (role, country) with diminishing boosts over time.
- **Smart Guess Triggers** — The AI decides when to guess based on candidate count and questions elapsed.

### 🎭 Dynamic AI Personas
The AI adapts its personality in real-time based on confidence and remaining questions:

| Persona | Trigger | Emoji |
|---------|---------|-------|
| 🤖 Neutral | Confidence 0–40% | Default analytical mode |
| 😎 Confident | Confidence 65–85% | Getting warmer... |
| 🔥 Hype | Confidence 85%+ | "I KNOW THIS ONE!" |
| 😰 Panic | ≤ 2 questions left | Sweating under pressure |
| 😮 Surprised | Unexpected answers | Plot twist reactions |

### 🎮 Game Modes
- **🎯 Classic Game** — Think of any IPL player and answer 20 questions
- **📅 Daily Challenge** — A new player challenge every day
- **🏆 Leaderboard** — Compete for the fastest wins

### 🎨 Premium Visual Design
- **Three.js 3D Stadium** — Immersive background with dynamic lighting that reacts to game state
- **Confidence Orb** — Glowing 3D sphere that pulses with the AI's certainty level
- **Particle Field** — Ambient floating particles for a cyberpunk atmosphere
- **Win Explosion** — Celebratory 3D particle burst on correct guesses
- **Avatar Model** — Animated 3D character representing the AI
- **Neon UI** — Glowing text, glassmorphism cards, and cyberpunk aesthetics

### 📊 Question Categories
The AI draws from **42 questions** across 7 strategic categories:

| Category | Questions | Example |
|----------|-----------|---------|
| 🏏 Role | 4 | "Is this player primarily a batsman?" |
| 🌍 Country | 8 | "Is this player from India?" |
| 🏃 Batting | 7 | "Does this player bat left-handed?" |
| 🎯 Bowling | 6 | "Is this player a spinner?" |
| 🏆 Career | 7 | "Has this player won an Orange Cap?" |
| 👕 Team | 10 | "Does this player play for CSK?" |
| 👤 Profile | 6 | "Is this player under 25 years old?" |

---

## 🏗️ Architecture

```
aki-cricket/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (3D landing)
│   ├── layout.tsx                # Root layout & metadata
│   ├── globals.css               # Global styles & design tokens
│   ├── game/                     # Main game page
│   ├── daily/                    # Daily challenge page
│   ├── leaderboard/              # Leaderboard page
│   └── api/                      # API Routes
│       └── game/
│           ├── start/            # POST — Initialize game session
│           ├── answer/           # POST — Process answer & next question
│           ├── guess/            # POST — Make final guess
│           └── feedback/         # POST — Record guess result
│
├── components/
│   ├── game/                     # Game UI Components
│   │   ├── AnswerButtons.tsx     # Yes / No / Maybe / Don't Know
│   │   ├── ConfidenceMeter.tsx   # Animated confidence bar
│   │   ├── PersonaTag.tsx        # AI mood indicator
│   │   ├── QuestionCard.tsx      # Current question display
│   │   └── QuestionCounter.tsx   # Progress tracker
│   │
│   ├── ui/                       # Reusable UI Components
│   │   ├── GlowButton.tsx        # Neon glow CTA buttons
│   │   ├── NeonText.tsx          # Glowing text component
│   │   └── StatsCard.tsx         # Stats display card
│   │
│   ├── three/                    # Three.js 3D Components
│   │   ├── StadiumScene.tsx      # Main 3D scene wrapper
│   │   ├── AvatarModel.tsx       # AI avatar character
│   │   ├── ConfidenceOrb.tsx     # Pulsing confidence sphere
│   │   ├── ParticleField.tsx     # Ambient particle system
│   │   └── WinExplosion.tsx      # Victory celebration effect
│   │
│   └── PWARegister.tsx           # Progressive Web App registration
│
├── hooks/
│   └── useGame.ts                # Core game state management hook
│
├── lib/
│   ├── engine/                   # AI Game Engine
│   │   ├── entropy.ts            # Shannon entropy & scoring logic
│   │   ├── persona.ts            # AI personality system
│   │   └── questions.ts          # Question bank (42 questions)
│   │
│   ├── db/                       # Database Layer
│   │   ├── mongoose.ts           # MongoDB connection
│   │   ├── models/               # Mongoose schemas
│   │   └── seed/                 # Player data seeding
│   │       ├── ipl-data.ts       # Master player export (150+)
│   │       ├── player-helper.ts  # Player factory utility
│   │       ├── players-legends-stars.ts
│   │       └── players-regulars.ts
│   │
│   ├── grok/                     # Grok AI integration
│   └── sounds.ts                 # Sound effects manager
│
├── public/                       # Static assets
├── firebase.json                 # Firebase hosting config
└── tailwind.config.ts            # Tailwind + custom theme
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- **MongoDB** (local or Atlas URI)
- **Grok API Key** (for AI-powered features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/neeraj5050/apl-26.git
cd apl-26/aki-cricket

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aki-cricket

# Grok AI (xAI)
GROK_API_KEY=your_grok_api_key_here

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Locally

```bash
# Development server
npm run dev

# Seed the player database
npm run seed

# Production build
npm run build
npm start
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 🎯 How It Works

### The Algorithm — Shannon Entropy

The AI uses **information theory** to pick the most informative question at each step:

```
H(X) = -Σ p(x) · log₂(p(x))
```

1. **Calculate entropy** for each remaining question based on how evenly it splits the candidate pool.
2. **Apply category weights** — Role & country questions get priority early game.
3. **Select the question** with the highest weighted entropy score.
4. **Filter & rank** candidates after each answer using a weighted scoring system.
5. **Trigger a guess** when candidates are sufficiently narrowed or questions run out.

### Answer Weighting

| Answer | Match | Mismatch |
|--------|-------|----------|
| Yes | +1.0 | −2.0 (hard penalty) |
| No | +1.0 (inverse) | −2.0 (hard penalty) |
| Maybe | +0.5 (soft signal) | +0.3 (soft pass) |
| Don't Know | 0.0 (skipped) | 0.0 (skipped) |

> 💡 **"Don't Know"** answers are free — they don't consume a question (up to 5 free passes).

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | SSR, routing, API routes |
| **Language** | TypeScript 5.6 | Type safety |
| **3D Graphics** | Three.js + React Three Fiber | Immersive visuals |
| **Animations** | Framer Motion 11 | Smooth transitions |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **Database** | MongoDB + Mongoose 8 | Player data & sessions |
| **AI** | Grok (xAI) + OpenAI SDK | AI-powered interactions |
| **Audio** | Howler.js | Sound effects |
| **Hosting** | Firebase Hosting | Static deployment |
| **PWA** | Service Worker | Installable app |

---

## 📦 Deployment

### Firebase Hosting

```bash
# Build for production (static export)
npm run build

# Deploy to Firebase
firebase deploy
```

The app is configured for static export via `next.config.js` for Firebase Hosting compatibility.

---

## 🧩 Key Design Decisions

- **Client-Side Engine**: The entropy engine runs entirely on the client (`useGame` hook) for instant responses — no network latency between questions.
- **Question Invalidation**: Smart dependency graph between questions prevents redundant asks (e.g., confirming "batsman" auto-skips all bowling questions).
- **Safety Net**: The engine never filters to zero candidates — always keeps a minimum of 5 players in the pool.
- **Dramatic Confidence Curve**: Confidence jumps non-linearly (e.g., 3 candidates → 75%, 1 candidate → 99%) for a more exciting experience.
- **Free "Don't Know" Passes**: Up to 5 "don't know" answers are free, encouraging honest play over guessing.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is built for **APL 26** (Academic Project).

---

## 👨‍💻 Author

**Neeraj** — [@neeraj5050](https://github.com/neeraj5050)

---

<p align="center">
  Built with 🏏 and ❤️ for IPL fans everywhere
</p>
]]>
