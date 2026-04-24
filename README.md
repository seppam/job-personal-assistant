# 🚀 JPA Assistant (Jobseeker Personal Assistant)

**JPA Assistant** is a premium, AI-powered career companion designed to revolutionize the job-seeking experience. By integrating advanced Large Language Models (LLMs), it provides job seekers with the tools they need to navigate the modern job market with confidence and precision.

---

## 📖 What is JPA Assistant?

JPA Assistant (Jobseeker Personal Assistant) is a comprehensive platform that acts as an intelligent intermediary between candidates and their career goals. It leverages AI to analyze, optimize, and secure every step of the job application process. Whether you're verifying the legitimacy of a job post or fine-tuning your resume for an ATS (Applicant Tracking System), JPA Assistant is your dedicated digital coach.

## 🎯 Purpose

The primary mission of JPA Assistant is to **democratize high-end career coaching**.
*   **Protection**: Shielding users from predatory or fraudulent job postings through AI-driven fraud detection.
*   **Optimization**: Helping candidates translate their experiences into the language of recruiters.
*   **Efficiency**: Reducing the time spent on manual resume tailoring and job analysis.
*   **Intelligence**: Providing data-driven insights into how well a candidate fits a specific role.

---

## ✨ Current Features

### 🤖 Intelligent AI Infrastructure
*   **Dynamic AI Router**: Seamlessly switches between **Google Gemini** and **Anthropic Claude** based on availability and preference.
*   **Smart Fallback Logic**: Automatically detects missing API keys or rate limits and routes requests to the next available model to ensure zero downtime.
*   **Rate Limit Management**: Built-in "Cool Down" detection to handle AI provider constraints gracefully.

### 🔍 Career Tools
*   **Smart Job Scanner**:
    *   Extracts text directly from job URLs.
    *   Scores vacancies for legitimacy and quality.
    *   Flags potential red flags for "Expert HR Fraud Investigation."
*   **CV Analysis & Matching**:
    *   Deep-dive comparison between resumes and Job Descriptions (JD).
    *   Provides match scores and actionable feedback on strengths and gaps.
*   **Linguistic Excellence Engine**:
    *   Polishes resume sections using impactful action verbs and professional terminology.
*   **PDF CV Export**:
    *   Generates professional, print-ready resumes directly from the application.

### 🎨 Design & Experience
*   **Modern Aesthetics**: Built with a "Glassmorphic" design system, utilizing vibrant gradients and sleek dark modes.
*   **Fluid Animations**: Powered by **Framer Motion** for a high-end, responsive feel.
*   **Real-time Feedback**: Interactive "Toasts" and status indicators for AI operations.

---

## 🛠 Tech Stack

*   **Frontend**: React 19, Vite, Redux Toolkit
*   **Styling**: Tailwind CSS 4, Framer Motion
*   **AI Providers**: Google Generative AI (Gemini), Anthropic SDK (Claude)
*   **Utilities**: Axios, Cheerio (Web Scraping), Lucide React (Icons), React PDF

---

## 📅 Feature Track & Updates

| Date | Update | Description |
| :--- | :--- | :--- |
| **2026-04-24** | **Documentation Refresh** | Initial comprehensive project documentation and feature mapping. |
| **2026-04-18** | **AI Router Refactor** | Implemented model-agnostic architecture with dynamic fallback support. |
| **2026-04-10** | **CV PDF Engine** | Integrated `@react-pdf/renderer` for professional document generation. |
| **2026-04-08** | **Core AI Services** | Initial launch of Job Detection and CV Matching services. |

---

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/jpa-assistant.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment**:
    Create a `.env` file and add your AI keys:
    ```env
    VITE_GEMINI_API_KEY=your_key_here
    VITE_ANTHROPIC_API_KEY=your_key_here
    ```
4.  **Run in development**:
    ```bash
    npm run dev
    ```

---
*Built with ❤️ for the future of work.*
