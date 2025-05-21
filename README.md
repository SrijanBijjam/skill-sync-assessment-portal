# SkillSync

SkillSync is a web application that helps candidates match their skills with perfect job opportunities. The platform analyzes resumes and professional profiles to connect users with ideal job matches.

## Project Overview

SkillSync offers the following features:
- Resume analysis to extract and evaluate skills
- Job opportunity matching based on skill profiles
- Easy-to-use interface for job seekers

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui components
- Tailwind CSS
- React Router
- TanStack Query

## How to Run the Project

### Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Environment Variables

You'll need to set up the following environment variables in a `.env` file in the root directory:

```
# OpenAI API Key for skill analysis
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Resume Parser API credentials (optional, falls back to local parsing)
VITE_RESUME_PARSER_API_URL=https://api.example.com/resume-parser
VITE_RESUME_PARSER_API_KEY=your_parser_api_key_here
```

Note: The `VITE_` prefix is required for environment variables to be accessible in the frontend code.

### Local Development

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository
git clone <repository-url>

# Step 2: Navigate to the project directory
cd skillsync

# Step 3: Install the necessary dependencies
npm install

# Step 4: Create a .env file with your environment variables
touch .env
# Add your environment variables to the .env file

# Step 5: Start the development server
npm run dev
```

This will launch a development server with auto-reloading and provide you with a local URL to view the application in your browser.

## Project Structure

- `/src/components`: UI components
- `/src/pages`: Page components for different routes
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and shared code
- `/src/services`: Service functions for API integrations

## Resume Parser Integration

SkillSync supports two methods for parsing resumes:

1. **Local Parsing** - Uses PDF.js to extract text and parse resume sections directly in the browser
2. **Enhanced API Parsing** - Uses an external Resume Parser API for improved accuracy through direct file upload

Users can toggle between these options in the interface before uploading their resume.

## Contributing

Contributions to SkillSync are welcome! Please ensure your code follows the existing patterns and passes all tests before submitting pull requests.
