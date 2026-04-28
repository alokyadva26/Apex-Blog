# Technology Stack: Apex Blog

This document details the specific versions and architectural choices for the Apex Blog platform, ensuring compatibility and high performance across the full-stack system.

## 1. Project Context
* [cite_start]**Type:** Full-stack Web Application (Next.js)[cite: 22].
* **Scale:** MVP for Internship Technical Assessment.
* **Branding:** Apex Blog.

## 2. Core Frameworks & Languages

| Technology | Version | Documentation | Selection Reason |
| :--- | :--- | :--- | :--- |
| **Next.js** | `14.1.0` | [nextjs.org](https://nextjs.org/docs) | [cite_start]Required by assignment[cite: 22]. Supports App Router and Server Actions. |
| **TypeScript** | `5.3.3` | [typescriptlang.org](https://www.typescriptlang.org/docs/) | [cite_start]Ensures type safety and improves code readability/quality. |
| **Node.js** | `20.x` | [nodejs.org](https://nodejs.org/docs) | [cite_start]Long-Term Support (LTS) version for stability on Vercel/Netlify[cite: 60]. |

## 3. Database & Authentication (Backend-as-a-Service)

| Technology | Version | Documentation | Selection Reason |
| :--- | :--- | :--- | :--- |
| **Supabase** | `2.39.7` | [supabase.com](https://supabase.com/docs) | [cite_start]Required for Database and Auth integration[cite: 7, 22]. |
| **Supabase Auth** | `Built-in` | [supabase.com/auth](https://supabase.com/docs/guides/auth) | [cite_start]Handles role-based access for Author, Viewer, and Admin[cite: 34]. |
| **PostgreSQL** | `15` | [postgresql.org](https://www.postgresql.org/docs/) | [cite_start]Scalable relational database for Users, Posts, and Comments[cite: 57]. |

## 4. AI & Integration

| Technology | Version | Documentation | Selection Reason |
| :--- | :--- | :--- | :--- |
| **Google Generative AI** | `0.2.1` | [ai.google.dev](https://ai.google.dev/docs) | [cite_start]Required for generating automated ~200-word summaries[cite: 22, 47]. |
| **Antigravity** | `Agent-v1` | [antigravity.ai](https://antigravity.ai/) | [cite_start]Approved AI coding assistant for development efficiency[cite: 14]. |

## 5. UI & Styling

* **Styling:** **Tailwind CSS (`3.4.1`)** - Used for rapid, responsive UI development.
* **Icons:** **Lucide React (`0.330.0`)** - Lightweight and professional icon set.
* [cite_start]**Form Management:** **React Hook Form (`7.50.1`)** - For high-performance post creation logic[cite: 76].

## 6. Environment Variables List
[cite_start]Required for local development and production deployment[cite: 62]:

```bash
# Supabase Connectivity
NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google AI Key
GOOGLE_AI_API_KEY=your-google-api-key-here