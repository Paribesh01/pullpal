
# PullPal – Your AI PR Copilot

PullPal is an AI-powered assistant for pull requests that transforms the way developers handle code reviews and PR workflows. It automates PR creation, generates professional descriptions, summarizes code changes, and provides actionable feedback — all powered by AI.

With PullPal, you don’t just write code — you merge it efficiently and confidently.

## 📌 Project Overview

PullPal is designed to solve the common pain points of pull requests:

- Drafting PRs manually is repetitive and time-consuming
- Reviewing code takes hours, especially when commits are complex
- Ensuring consistency and quality across teams is challenging

PullPal tackles all of these by providing:

- Automatic PR Generation: Converts raw commits into polished pull requests automatically
- Professional PR Titles & Descriptions: Generates clean, readable, and informative Markdown
- Code Change Summaries: Highlights key changes so teammates instantly understand what changed
- AI-Powered Review Feedback: Analyzes PRs for bugs, code smells, missing tests, and improvements
- Customizable Review Styles: Choose from strict senior dev, supportive mentor, or security expert

PullPal is more than a Copilot — it’s an end-to-end PR assistant that saves time, speeds up reviews, and maintains repository quality.

## ✨ Features

| Feature | Description |
|---|---|
| Auto PR Generation | Assign PullPal to a branch and it drafts a merge-ready PR |
| PR Titles & Descriptions | Generates professional Markdown-based titles and summaries |
| Code Summaries | Provides clear summaries of code changes to make reviews easier |
| PR Issue Detection | Detects bugs, missing tests, or code smells before human review |
| Custom Review Styles | Feedback styles include senior dev, mentor, or security expert |
| End-to-End Workflow | Automates the PR flow: creation → review → merge |

## 💡 How It Works

1. Commit Analysis: PullPal scans all commits in the assigned branch
2. PR Drafting: AI generates the PR title, description, and change summary
3. Review Suggestions: Highlights potential bugs, missing tests, and best-practice improvements
4. Feedback Customization: Choose the style of review
5. Merge Ready: After review, the PR is ready for handoff or direct merge

## ⚡ Benefits

- Saves Time: Automates repetitive PR tasks and review notes
- Improves Code Quality: Detects potential issues earlier
- Speeds Up Team Reviews: Summaries and structured PRs make reviewing faster
- Consistency Across Repos: Maintains a standard style and format
- Customizable for Teams: Adapts to your workflow and preferences

## 🖥️ Tech Stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL (optional for PR metadata and user preferences)
- AI/ML: OpenAI GPT API for generation and review feedback

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- GitHub repository access
- OpenAI API key (for AI PR generation)

### Installation

```bash
git clone https://github.com/birat04/pullpal.git
cd pullpal
npm install
```

### Running Locally

```bash
npm run dev
```

Then connect PullPal to your GitHub repository and start generating PRs automatically.

## 💻 Usage

1. Connect to a repository – Link PullPal to a branch in your GitHub repo
2. Generate a PR – PullPal scans the commits and drafts a PR automatically
3. Review – AI provides feedback in the selected style
4. Merge – PR is ready for handoff to teammates or direct merge

Optional: Configure review style preferences and notification settings for your team.

## 🔧 Customization

PullPal can be customized for:

- Team-specific review styles
- PR templates and formatting
- Auto-merge policies
- Integration with CI/CD pipelines

## 📂 Project Structure

```text
pullpal/
├─ backend/          # Node.js + Express backend
├─ frontend/         # React + Tailwind UI
├─ database/         # PostgreSQL setup and migrations
├─ scripts/          # Utility scripts for PR generation
├─ README.md         # Project overview
└─ package.json
```

## 🤝 Contributing

We welcome contributions! You can:

- Report bugs or feature requests via GitHub Issues
- Submit pull requests for improvements or new features
- Suggest additional AI review styles or integrations

