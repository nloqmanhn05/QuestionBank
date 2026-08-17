# 🎓 ICT Professional & Ethics Master Question Bank (React Edition)

An interactive, responsive, and modern web application built with **React** and **Vite** designed for students and professionals to practice and master **ICT Professional Ethics & Computer Studies**. Built with a sleek bento-grid layout, real-time analytics, celebratory feedback, and detailed explanations for all 210 questions.

---

## 🌟 Features

- **⚛️ Modern React Architecture**: Modular, component-driven UI with custom React hooks (`useQuestionBank`, `useTour`).
- **🧩 Interactive Onboarding Tour**: Step-by-step guided walkthrough highlighting and explaining every button and UI component on first visit or on demand via the **Tour Guide** button.
- **📚 210 Curated Practice Questions**: Distributed evenly across 7 core course chapters (30 questions per chapter).
- **💡 Instant Explanations**: Every question provides immediate feedback, complete with slide references and detailed rationale.
- **⚡ Quick Jump Navigation Grid**: Interactive 30-dot matrix pane allows seamless jump to any question with real-time status indicators (🟢 Correct / 🔴 Wrong / ⚪ Unanswered).
- **📊 Live Performance Analytics**: Tracks overall score, percentage accuracy, and individual chapter completion progress in real time.
- **🎨 Premium Bento Layout**: Dual-pane responsive architecture featuring high-legibility typography (*Fraunces*, *Instrument Serif*, *Inter*, *JetBrains Mono*) and custom paper-theme styling.
- **🔄 Chapter Reset & Practice**: Easily reset individual chapter progress to retake quizzes and reinforce learning.
- **🎉 Completion Celebrations**: Particle confetti animation when completing all questions in a chapter.

---

## 📖 Course Chapters Covered

| Chapter | Module Title | Questions | Key Topics |
| :---: | :--- | :---: | :--- |
| **1** | **Occupation Areas & ICT Professions** | 30 | AI/ML, Cybersecurity, Data Analysis, Digital Marketing, E-commerce, Industry Salaries, & BSc CS Career Tracks |
| **2** | **Ethics, Islamic Ethics & Ethical Theories** | 30 | Utilitarianism, Deontology, Virtue Ethics, Islamic Principles (*Maqasid al-Shariah*), & Professional Codes |
| **3** | **IT Implication, Benefits & New Technologies** | 30 | Emerging Tech, Automation, IoT, Cloud Computing, & Societal Impacts of Digital Transformation |
| **4** | **Privacy & Computer Technology** | 30 | Data Protection, Surveillance, GDPR/PDPA Laws, Cookies, Encryption, & Information Security |
| **5** | **Freedom of Speech & Censorship** | 30 | Content Moderation, Online Expression, Cyberbullying, Net Neutrality, & Digital Censorship Laws |
| **6** | **Digital Media & Editing Reliability** | 30 | Deepfakes, Photo/Video Manipulation, Fake News, Media Verification, & Digital Forensics |
| **7** | **Intellectual Property (IP)** | 30 | Copyrights, Patents, Trademarks, Trade Secrets, Fair Use, Open Source & Software Licensing |

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Tailwind CSS + Custom Vanilla CSS design tokens & animations (`src/index.css`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (*Fraunces*, *Instrument Serif*, *Inter*, *JetBrains Mono*)
- **Animations / Effects**: Canvas Confetti
- **Backend / Analytics**: Firebase Analytics & Auth Integration

---

## 📁 Repository Structure

```
QuestionBank/
├── index.html              # Vite entry HTML with custom fonts & metadata
├── package.json            # Vite, React, Lucide, Tailwind dependencies
├── vite.config.js          # Vite build and dev server config
├── tailwind.config.js      # Custom theme color extensions & typography
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Main App layout & layout orchestration
│   ├── index.css           # Design tokens, fonts, custom paper theme, bento utilities
│   ├── data/
│   │   └── questionBank.js # Complete 210 curated questions across 7 chapters
│   ├── services/
│   │   └── firebase.js     # Firebase auth & analytics helpers
│   ├── hooks/
│   │   ├── useQuestionBank.js # Quiz progress, answers, scoring & localStorage state
│   │   └── useTour.js         # Tour step management and spotlight positioning
│   └── components/
│       ├── Sidebar.jsx        # Navigation, score counters, chapter list, reset button
│       ├── QuickJumpGrid.jsx  # 30-dot question matrix with live status indicators
│       ├── QuestionCard.jsx   # Question prompt, multiple-choice options, feedback panel
│       ├── QuestionHeader.jsx # Chapter badge, title, tour button, Prev/Next navigation
│       ├── TourModal.jsx      # Spotlight overlay, step popover card, keyboard controls
│       └── AuthModal.jsx      # Cloud sync / account modal notice
└── README.md               # Project documentation & reference guide
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📝 License

This project is created for educational purposes. Feel free to use, modify, and distribute for study and review.
