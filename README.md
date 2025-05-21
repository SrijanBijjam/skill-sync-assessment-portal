# SkillSync Documentation

SkillSync is a modern web application that empowers candidates to match their skills with the perfect job opportunities. It leverages advanced resume parsing, AI-powered profile summarization, and intelligent job matching to provide a seamless experience for job seekers.

---

## Table of Contents

1. [Overview](#overview)
2. [Main Features](#main-features)
   - [Resume Parsing](#resume-parsing)
   - [AI-Summarized Profile Summary](#ai-summarized-profile-summary)
   - [AI-Powered Job Matching](#ai-powered-job-matching)
   - [Cache Clearing and Data Removal](#cache-clearing-and-data-removal)
3. [How to Use the App](#how-to-use-the-app)
4. [How to Run the Project Locally](#how-to-run-the-project-locally)
5. [File Structure and Codebase Guide](#file-structure-and-codebase-guide)
6. [Contributing](#contributing)
7. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Overview

SkillSync is designed to help candidates:
- Upload and parse their resumes (PDF)
- Extract and review their skills, experience, and personal info
- Get an AI-generated professional summary
- Match their profile against job descriptions using AI, with detailed feedback and scoring

The app is built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and leverages **OpenAI** for AI features.

The (working) deployed link to the project: https://skill-sync-assessment-portal.vercel.app 

---

## Main Features

### Resume Parsing

- **Upload**: Users can upload their resume in PDF format.
- **Parsing**: The app uses a local PDF parser (PDF.js) to extract:
  - Full text
  - Skills
  - Experience
  - Projects
  - Education
  - Certifications
  - Personal information (name, email, phone, etc.)
- **Section Extraction**: The parser uses regex and heading detection to accurately extract relevant sections from various resume formats.

### AI-Summarized Profile Summary

- After parsing, the app uses OpenAI's GPT-4o nano model to generate a concise, professional summary of the candidate's background.
- The summary highlights key skills, experience, and qualifications, and is tailored to be suitable for use in job applications or LinkedIn profiles.

### AI-Powered Job Matching

- **Job Description**: The app includes a sample job description (configurable in the code).
- **Matching Algorithm**: When the user proceeds, the app sends both the candidate profile and the job description to OpenAI.
- **AI Analysis**: The AI:
  - Extracts 4-6 key skills/competencies from the job description
  - Scores the candidate (0-100) for each skill based on their resume/profile
  - Provides an overall match percentage
  - Lists strengths, gaps, and personalized recommendations
  - Generates a summary paragraph explaining the match
- **Scoring**: The numbers and percentages are calculated by the AI model, which analyzes the overlap between the candidate's skills/experience and the job requirements. The scores are not random—they are based on the actual content of the resume and job description.

### Cache Clearing and Data Removal

- **Remove Resume**: Pressing 'Remove' in the Upload Your Resume section clears all form fields and resets the profile data. This is why it takes you back to the home page or the initial upload state.
- **Clear Cache Page**: There is a dedicated page to clear all stored data (localStorage), which is useful for troubleshooting or starting fresh.

---

## How to Use the App

1. **Upload Resume**: Start by uploading your PDF resume.
2. **Review Extracted Data**: The app will parse your resume and extract your skills, experience, and personal info. Review and edit as needed.
3. **Profile Summary**: Get an AI-generated summary of your profile.
4. **Job Matching**: The app will match your profile against a job description and provide a detailed analysis, including scores, strengths, gaps, and recommendations.
5. **Remove/Clear Data**: You can remove your resume and clear all data at any time.

---

## How to Run the Project Locally

### Prerequisites

- Node.js & npm (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Steps

```sh
# 1. Clone the repository
git clone <repository-url>

# 2. Navigate to the project directory
cd skillsync

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI and Resume Parser API keys

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## File Structure and Codebase Guide

Here's an overview of the main folders and files:

```
/src
  /components
    /analyze
      ResumeUploadStep.tsx      # Handles resume upload, parsing, and removal
      SkillsExperienceStep.tsx  # Form for reviewing/editing skills & experience
      PersonalInfoStep.tsx      # Form for reviewing/editing personal info
      QuestionsStep.tsx         # Additional questions for the candidate
      StepProgress.tsx          # Visual step progress indicator
    Footer.tsx                  # Footer component (centered content)
    Navbar.tsx                  # Top navigation bar
    ui/                         # Reusable UI components (buttons, cards, etc.)
  /pages
    Analyze.tsx                 # Main multi-step analysis flow
    JobMatching.tsx             # Job matching results page
    ClearCache.tsx              # Page to clear all stored data
    NotFound.tsx                # 404 page
    Index.tsx                   # Landing page
  /hooks
    useProfileData.ts           # Custom hook for managing profile data and localStorage
  /lib
    resume-parser.ts            # Local PDF resume parsing logic (PDF.js + regex)
    utils.ts                    # Utility functions
  /services
    openai.ts                   # OpenAI API integration for summary and job matching
    resumeParserApi.ts          # (If using) External Resume Parser API integration
  /config
    jobDescription.ts           # The job description used for AI matching
  /assets
    ...                         # Images, logos, etc.
  index.css                     # Global styles (Tailwind)
  main.tsx                      # App entry point
  App.tsx                       # Main app component and router
```

### Folder/File Purposes

- **/components**: All React components, including UI and feature-specific components.
- **/components/analyze**: Steps for the multi-step analysis flow.
- **/components/ui**: Reusable UI primitives (buttons, cards, etc.).
- **/pages**: Top-level pages/routes.
- **/hooks**: Custom React hooks for state and data management.
- **/lib**: Utility libraries, including the local resume parser.
- **/services**: API integrations (OpenAI, external resume parser).
- **/config**: Static configuration, such as the job description.
- **/assets**: Static assets (images, icons).
- **index.css**: Tailwind and global styles.
- **main.tsx**: App entry point.
- **App.tsx**: Main app shell and router.

---

## Contributing

Contributions are welcome! Please:
- Follow the existing code style and patterns
- Write clear, maintainable code
- Test your changes
- Submit a pull request with a clear description

---

## Troubleshooting & FAQ

**Q: Why does pressing 'Remove' in the Upload Resume section clear all my data?**  
A: This is by design. Pressing 'Remove' clears all form fields and profile data, resetting the app to its initial state so you can start fresh.

**Q: What file formats are supported for resume upload?**  
A: Currently, only PDF files are supported.

**Q: How are the job match scores and percentages calculated?**  
A: The AI analyzes your profile and the job description, extracts key skills from the job requirements, and scores your profile for each skill (0-100). The overall match score is based on how well your skills and experience align with the job.

**Q: Can I use my own job description?**  
A: Yes, you can modify `/src/config/jobDescription.ts` to use your own job description for matching.

**Q: What if the resume parser misses some information?**  
A: You can manually edit your skills, experience, and personal info after parsing.

**Q: How do I clear all my data?**  
A: Use the "Clear Cache" page or the "Remove" button in the upload step.

---

## Summary

SkillSync is a powerful, modern tool for job seekers to analyze and improve their professional profile using AI. With robust resume parsing, AI-generated summaries, and intelligent job matching, it provides actionable insights and a seamless user experience.

If you have any questions or want to contribute, please check the codebase, open an issue, or submit a pull request!
