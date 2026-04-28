# Product Requirements Document: Apex Blog Platform

## 1. Problem Statement
Current blogging workflows require manual effort for content summarization, leading to inconsistent post previews and lower reader engagement. [cite_start]Additionally, simple platforms often lack clear, secure role-based access control (RBAC), making it difficult to manage content quality and community interactions effectively [cite: 33-34].

## 2. Goals & Objectives
* [cite_start]**Automated Summarization**: Implement a system that automatically generates a ~200-word summary for every new post using the Google AI API [cite: 46-47].
* [cite_start]**Secure Access Control**: Build a robust RBAC system where Author, Viewer, and Admin roles have strictly defined permissions [cite: 33-34].
* [cite_start]**Cost Optimization**: Reduce API costs by generating the AI summary only once and storing it in the database for repeated retrieval[cite: 82, 87].
* [cite_start]**Full-Stack Integration**: Successfully integrate Next.js, Supabase (Auth and Database), and a Google AI API into a single functional platform[cite: 7, 22].

## 3. Success Metrics
* [cite_start]**Summarization Reliability**: 100% of newly created posts have a generated summary stored in the database[cite: 90].
* [cite_start]**Role Enforcement**: 0% unauthorized access to Admin-only or Author-only functions (like editing other people's posts)[cite: 90].
* [cite_start]**Performance**: The post listing page displays the title, featured image, and AI summary with efficient pagination[cite: 43, 49].
* [cite_start]**Code Quality**: Evidence of effective AI-assisted development through clear, readable code and detailed explanations of AI tool usage[cite: 90].

## 4. Target Personas
### **Persona A: The Content Creator (Author)**
* [cite_start]**Permissions**: Create posts, edit their own posts, and view comments on their posts[cite: 34].
* **Goals**: Create and edit their own posts while having the system handle the summarization automatically.

### **Persona B: The Community Manager (Admin)**
* [cite_start]**Permissions**: View all posts, edit any post, and monitor comments[cite: 34].
* **Goals**: Have the ability to view and edit any post and monitor all site comments.

## 5. Features

### **P0: MVP Must-Haves**
#### **1. Role-Based Authentication (Supabase)**
* [cite_start]**Description**: A login system where users are assigned one of three roles: Author, Viewer, or Admin [cite: 33-34].
* **Implementation**: Uses Supabase Auth for identity management. [cite_start]Roles are stored in the `Users` table (`id`, `name`, `email`, `role`)[cite: 57].

#### **2. AI Post Summarization**
* [cite_start]**Description**: Automatic generation of a summary using the Google AI API upon post creation [cite: 46-47].
* [cite_start]**Constraints**: The summary is ~200 words and is stored in the `Posts` table to avoid repeated API calls [cite: 47-48, 87].

### **P1: Important Features**
#### **1. Blog Management & Comments**
* **Description**: Authors and Admins can create/edit posts; [cite_start]Viewers can read and comment [cite: 34-35].
* **Data Fields**:
    * [cite_start]**Posts**: `id`, `title`, `body`, `image_url`, `author_id`, `summary`[cite: 57].
    * [cite_start]**Comments**: `id`, `post_id`, `user_id`, `comment_text`[cite: 57].
* [cite_start]**Navigation**: Include a functional search for posts and pagination for the listing page [cite: 42-43].

## 6. Explicitly OUT OF SCOPE
1. **Draft Modes**: No ability to save posts as drafts; all posts live upon creation.
2. **User Profiles**: No public-facing user profile pages beyond name in DB.
3. **Social Sharing**: No native buttons for sharing to social media platforms.
4. **Advanced Analytics**: No tracking of view counts or click rates.
5. **Direct Image Hosting**: Using external image URLs instead of a custom file upload server.

## 7. User Scenarios
### **Scenario 1: Author Publishing**
* [cite_start]**Steps**: An Author logs in, provides a title, image URL, and body content, then clicks save [cite: 36-39].
* [cite_start]**Outcome**: System generates AI summary, stores it, and post appears in feed [cite: 46-49].

### **Scenario 2: Viewer Interaction**
* [cite_start]**Steps**: A Viewer browses the paginated feed, uses the search bar, and reads the AI summary [cite: 42-43, 49].
* [cite_start]**Outcome**: Viewer clicks the post and adds a comment[cite: 40].

## 8. Non-Functional Requirements
* [cite_start]**Security**: Use Row Level Security (RLS) in Supabase to protect role-specific data[cite: 90].
* [cite_start]**Deployment**: The app must be publicly accessible on Vercel or Netlify [cite: 60-61].
* [cite_start]**Cost Optimization**: Use token reduction strategies by generating the summary only once[cite: 82, 87].