# ScorePulse ⚡ Real-Time Live Sports Scoreboard

<div align="center">

![ScorePulse Badge](https://img.shields.io/badge/ScorePulse-06B6D4?style=for-the-badge&logo=zap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A high-performance, real-time live sports scoreboard platform featuring live Football, Basketball, Tennis, and Cricket matches, automated time-aware match evaluation, auto-calculated league standings, and a dark glassmorphism UI.**

[Overview](#overview) • [Key Features](#key-features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Live Data Sync](#live-data-sync)

</div>

---

## Overview

**ScorePulse** is a full-stack real-time sports scoreboard application. It synchronizes 100% real live match data across 4 major sports (**Football, Basketball, Tennis, Cricket**), provides automated match status calculation (`upcoming`, `live`, `completed`), dynamic league standings, and a responsive glassmorphism user interface.

**Status:** ✅ **Production Ready**

---

## Key Features

- ⚽ **Football Live Data**: Real fixtures synced from RapidAPI Football.
- 🏀 **Basketball Live Data**: Real games synced from API-Sports Basketball.
- 🎾 **Tennis Live Data**: Real tournament matches synced from ESPN Tennis API.
- 🏏 **Cricket Live Data**: Real live scores synced from ESPNCricinfo.
- ⏱️ **Dynamic Time-Aware Status Engine**: Automatically transitions matches to `live` or `completed` based on start times and match durations.
- 🏆 **League Standings Leaderboard**: Multi-sport standings with metallic rank badges (🥇 #1, 🥈 #2, 🥉 #3), points, and goal/runs differences.
- 🎨 **Modern Dark Glassmorphism UI**: Styled with `Plus Jakarta Sans`, glass cards, ambient background glows, and live dot pulse indicators.
- 👤 **User Dashboard**: Username display in floating glass navbar, follow/unfollow matches, live stats overview.
- ⚡ **Real-Time WebSockets**: Live score and timeline updates via Socket.IO.

---

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
# App opens at http://localhost:3000
```

---

## Live Data Sources

| Sport | Live Data Source | Real Matches |
| :--- | :--- | :---: |
| ⚽ **Football** | RapidAPI Football (`api-football-v1`) | 50+ |
| 🏀 **Basketball** | API-Sports Basketball | 18+ |
| 🎾 **Tennis** | ESPN Tennis API | 100+ |
| 🏏 **Cricket** | ESPNCricinfo Live Feed | 7+ |
