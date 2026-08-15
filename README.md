# 🎓 ICT Professional & Ethics Master Question Bank

An interactive, responsive, and modern web application designed for students and professionals to practice and master **ICT Professional Ethics & Computer Studies**. Built with a sleek bento-grid layout, real-time analytics, and detailed explanations for all 210 questions.

---

## 🌟 Features

- **🧩 Interactive Onboarding Tour**: Step-by-step guided walkthrough highlighting and explaining every button and UI component on first visit or on demand via the **Tour Guide** button.
- **📚 210 Curated Practice Questions**: Distributed evenly across 7 core course chapters (30 questions per chapter).
- **💡 Instant Explanations**: Every question provides immediate feedback, complete with detailed rationale.
- **⚡ Quick Jump Navigation Grid**: Interactive 30-dot matrix pane allows seamless jump to any question with real-time status indicators (🟢 Correct / 🔴 Wrong / ⚪ Unanswered).
- **📊 Live Performance Analytics**: Tracks overall score, percentage accuracy, and individual chapter completion progress in real time.
- **🎨 Premium Bento Layout**: Dual-pane responsive architecture featuring high-legibility typography (*Fraunces*, *Instrument Serif*, *Inter*, *JetBrains Mono*) and custom paper-theme styling.
- **🔄 Chapter Reset & Practice**: Easily reset individual chapter progress to retake quizzes and reinforce learning.

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

- **Structure**: HTML5 (Semantic elements, accessible components)
- **Logic**: Vanilla JavaScript (ES6+ state management, dynamic DOM rendering)
- **Styling**: Tailwind CSS CDN + Custom Vanilla CSS design tokens & animations (`styles.css`)
- **Icons**: [FontAwesome 6](https://fontawesome.com/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (*Fraunces*, *Instrument Serif*, *Inter*, *JetBrains Mono*)

---

## 📁 Repository Structure

```
QuestionBank/
├── index.html        # Primary HTML UI markup & dual-pane layout
├── script.js        # Question datasets (210 Qs), explanations, state management & logic
├── styles.css        # CSS variable tokens, custom scrollbars, animations & layout tweaks
└── README.md         # Project documentation & reference guide
```

---

## 🚀 Getting Started

### 1. Run Locally
No build process or node dependencies are required! You can run the app directly in any web browser:

1. Clone or download the repository:
   ```bash
   git clone https://github.com/nloqmanhn05/QuestionBank.git
   ```
2. Open `index.html` directly in your browser or start a local server using VS Code's **Live Server** extension.

### 2. Pushing to GitHub

If you are setting up or updating the GitHub remote repository for the first time:

```bash
# Add the remote repository URL
git remote add origin https://github.com/nloqmanhn05/QuestionBank.git

# Set default branch to main and push
git branch -M main
git push -u origin main
```

---

## 📝 License

This project is created for educational purposes. Feel free to use, modify, and distribute for study and review.
