# 🧠 NeonFocus PWA
> A premium, mobile-first revision tracker and focus timer designed for deep work and spaced repetition.

![Version](https://img.shields.io/badge/version-10.1-cyan)
![Status](https://img.shields.io/badge/status-stable-success)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-purple)

**NeonFocus** is a distraction-free Progressive Web App (PWA) built to help students and professionals manage revision cycles using the Spaced Repetition System (SRS). It combines a task tracker, active recall flashcards, and a customizable focus timer into a single, aesthetic interface.

## ✨ Key Features

### 📚 Smart Revision Tracker
* **Spaced Repetition:** Automatically schedules reviews based on spaced intervals (e.g., 3, 7, 14, 30 days) to maximize long-term retention.
* **Custom Intervals:** Fully customizable review cycles to fit your personal learning pace.
* **Subject Color Coding:** visually organize subjects with custom neon tags.

### 🧠 Active Recall Mode
* **Flashcard Drill:** A dedicated study mode that hides notes/answers until you are ready.
* **Self-Grading:** Rate your recall as **Easy (2x interval)**, **Medium (1x interval)**, or **Hard (0.5x interval)** to adjust future scheduling dynamically.

### ⏱️ Deep Focus Timer
* **Flexible Cycles:** Choose between **Pomodoro (25/5)** or **Deep Work (52/17)**.
* **Ambient Soundscapes:** Built-in white noise generator with **Heavy Rain** and **Forest Morning** sounds.
* **Blackout Mode:** An OLED-friendly overlay to prevent screen burn-in and reduce distractions while studying.
* **Wake Lock:** Prevents your phone screen from sleeping during a timer session.

### 🎨 Premium Experience
* **3 Themes:** Switch between **Neon** (Default), **Blackout** (OLED), and **Warm** (Eye-comfort).
* **Glassmorphism UI:** Modern, translucent design aesthetic.
* **Haptic Feedback:** Tactile vibrations for interactions (Mobile only).
* **Offline Ready:** Works 100% without internet via Service Worker caching.

### 📊 Analytics & Data
* **Mastery Score:** Real-time calculation of your overall retention progress.
* **Heatmap:** GitHub-style activity grid tracking your study consistency over the last 90 days.
* **Data Privacy:** All data is stored locally on your device (LocalStorage).
* **Backup & Restore:** Export your database to JSON and restore it on any device.

---

## 🚀 How to Install (PWA)

This app is designed to be installed on your phone's home screen for a native app-like experience.

### On Android (Chrome)
1.  Open the website.
2.  Tap the **Menu** (three dots) in the top right.
3.  Tap **"Add to Home Screen"**.
4.  Launch from your app drawer.

### On iOS (Safari)
1.  Open the website.
2.  Tap the **Share** button (bottom center).
3.  Scroll down and tap **"Add to Home Screen"**.

---

## 🛠️ Technology Stack
* **Core:** HTML5, CSS3 (Variables, Flexbox/Grid), Vanilla JavaScript (ES6+).
* **Storage:** LocalStorage API.
* **Audio:** Web Audio API (Oscillators & Streamed Ambience).
* **Architecture:** Monolithic (Single-file architecture for maximum stability on GitHub Pages).

---

## 📸 Screenshots

| Dashboard | Active Recall | Focus Timer |
|:---:|:---:|:---:|
| *(Add screenshot of dashboard)* | *(Add screenshot of flashcards)* | *(Add screenshot of timer)* |

---

## 🤝 Contributing

This project is a personal tool, but suggestions are welcome!
1.  Fork the repository.
2.  Create a feature branch.
3.  Submit a Pull Request.

---

**Created with ❤️ for efficient learning.**
