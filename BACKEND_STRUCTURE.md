# Backend Structure: Apex Blog

## 1. Schema Definition
- [cite_start]**Users**: id, name, email, role (Author, Viewer, Admin).
- [cite_start]**Posts**: id, title, body, image_url, author_id, summary.
- [cite_start]**Comments**: id, post_id, user_id, comment_text.

## 2. Logic & Flow
- [cite_start]**AI Summary**: Triggered on POST creation; stored in DB to optimize costs[cite: 46, 87].
- [cite_start]**RBAC**: Enforcement via Supabase RLS and Next.js middleware [cite: 33-34].
- [cite_start]**Features**: Pagination (10 per page), Search, and Monitoring (Admin only) [cite: 34, 42-43].

## 3. Tech Specs
- **Database**: PostgreSQL 15 (Supabase).
- **Auth**: Supabase Auth with Role-based redirection.
- **AI**: Google Generative AI SDK (free tier).