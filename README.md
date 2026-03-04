# DOKit Standard Client Dashboard

AI-powered document intelligence platform for healthcare organizations.

## Overview

This is the standard DOKit client dashboard — the self-serve SaaS version of the DOKit platform. It provides document intake, AI extraction, workflow automation, and analytics for healthcare document processing.

## Features

- **Document Intake** — Upload or email documents for AI processing
- **AI Extraction** — GPT-4 powered extraction with 98%+ accuracy
- **Review Queue** — Human-in-the-loop for low-confidence extractions
- **Decision Rules** — Configure auto-approval and routing rules
- **Integrations** — Webhooks, API, and pre-built connectors
- **Reports & Analytics** — Processing metrics and audit trail

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL with Row-Level Security
- **AI**: AWS Textract + OpenAI GPT-4
- **Hosting**: Railway (staging) → AWS (production)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Design Preview

Open `index.html` directly in a browser for the static design preview.

## Deployment

- **Staging**: Auto-deploys to Railway on push to `main`
- **Production**: AWS ECS (HIPAA compliant) — manual deploy

## License

Proprietary — DOKit / BLUPRYNT
