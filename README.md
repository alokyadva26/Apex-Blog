# Apex Blog Platform

A modern, full-stack blogging platform built with Next.js, Supabase, and Google Generative AI.

## Features

* **Role-Based Access Control**: Secure roles for Viewers, Authors, and Admins.
* **AI Post Summarization**: Automatic generation of engaging summaries for every new post using the Google Gemini AI.
* **Responsive Design**: Modern UI built with Tailwind CSS.
* **Interactivity**: Users can comment, search posts, and navigate via pagination.

## Tech Stack

* **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript
* **Backend/Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
* **AI Integration**: Google Generative AI SDK (`gemini-pro`)

## Setup Instructions

### 1. Supabase Configuration
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor in your Supabase dashboard.
3. Open `database.sql` from this repository and run the entire script to create the necessary tables, types, triggers, and Row Level Security (RLS) policies.

### 2. Environment Variables
Copy `.env.local.example` or update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_google_ai_studio_api_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

## Role Assignment
* By default, every new user who signs up is assigned the **Viewer** role via the Supabase Auth trigger.
* To make a user an **Author** or **Admin**, go to your Supabase Table Editor, open the `users` table, and manually change their `role` field.

## Deployment
This app is ready to be deployed on Vercel:
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GOOGLE_AI_API_KEY`).
4. Deploy!
