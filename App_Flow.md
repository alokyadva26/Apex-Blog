# App Flow Documentation: Apex Blog

[cite_start]This document outlines the user journey, navigation structure, and system logic for the Apex Blog platform, ensuring compliance with the technical requirements of the internship assignment[cite: 7].

## 1. Entry Points
* [cite_start]**Direct Navigation**: Users landing on the homepage to browse public posts[cite: 49].
* [cite_start]**Authentication Portal**: Users accessing `/auth` to login or register for role-specific permissions[cite: 33].
* **Shared Content**: Deep links to specific blog post detail pages.

## 2. Core User Flows

### **A. Onboarding & Registration (Supabase Auth)**
* **Happy Path**:
    1.  **Page**: `/auth`
    2.  **Action**: User enters email and password.
    3.  [cite_start]**System**: Supabase Auth creates the account; a database trigger assigns the default role of **Viewer** in the `Users` table[cite: 34, 57].
    4.  **Outcome**: User is redirected to the home page with access to comment.
* **Error States**:
    * *Invalid Credentials*: "Invalid login credentials" alert appears.
    * *Network Timeout*: "Connection lost. Please try again."

### **B. Post Creation & AI Summarization (Author/Admin Only)**
* **Happy Path**:
    1.  **Page**: `/dashboard/create`
    2.  [cite_start]**Action**: Author enters Title, Featured Image URL, and Body Content [cite: 36-39].
    3.  **User Action**: Clicks "Publish."
    4.  **System Response**: 
        * Sends post body to Google AI API.
        * [cite_start]Generates a ~200-word summary [cite: 46-47].
        * [cite_start]Stores post + summary in the `Posts` table[cite: 48, 57].
    5.  [cite_start]**Outcome**: Redirects to Home; summary is visible in the post card[cite: 49].
* **Error States**:
    * [cite_start]*AI Generation Failure*: If the API fails, the system saves the post and flags the summary for manual retry in the dashboard to optimize costs[cite: 87].

### **C. Viewing & Interaction (All Roles)**
* **Happy Path**:
    1.  **Page**: `/` (Home)
    2.  [cite_start]**Action**: User uses the **Search Bar** or **Pagination** to find content [cite: 42-43].
    3.  **Action**: Clicks a post to view the full body and comments.
    4.  [cite_start]**User Action**: Viewer types a comment and hits "Submit"[cite: 34, 40].
    5.  [cite_start]**Outcome**: Comment is saved to the `Comments` table and displayed[cite: 57].

## 3. Navigation Map
* [cite_start]**`/` (Home)**: Post listing grid with AI summaries, search, and pagination[cite: 42, 43, 49].
* [cite_start]**`/post/[id]`**: Detailed view of the post and the comment section[cite: 40].
* **`/auth`**: Login/Signup toggle.
* **`/dashboard`**: 
    * [cite_start]**Author View**: List of owned posts with "Edit" and "Create New" options[cite: 34].
    * [cite_start]**Admin View**: Master list of all posts and a moderation panel for comments[cite: 34].

## 4. Screen Inventory

| Route | Access Level | Key Elements | Actions |
| :--- | :--- | :--- | :--- |
| `/` | Public | Search Bar, Post Cards, Pagination | Search, View Post, Navigate Pages |
| `/post/[id]` | Public | Full Body, Featured Image, Comment Box | Post Comment |
| `/dashboard` | Logged In | Post Management Table | Edit Post, Delete Post |
| `/create` | Author/Admin | Title, Image URL, Rich Text Body | Generate AI Summary & Publish |

## 5. Decision Points
* [cite_start]**IF** User Role = **Viewer** **THEN** Access to dashboard `/create` or `/edit` is restricted (403 Forbidden)[cite: 34].
* [cite_start]**IF** User Role = **Author** **THEN** "Edit" is only available for posts where `author_id` matches current user[cite: 34].
* [cite_start]**IF** User Role = **Admin** **THEN** "Edit" and "Monitor" buttons are visible on all content[cite: 34].

## 6. Error Handling
* **404 Page**: Displayed if a post ID does not exist in the Supabase database.
* **Offline Mode**: A toast notification informs the user that actions like "Post" or "Comment" cannot be completed without internet.
* **Validation**: Forms will not submit if Title or Body fields are empty.

## 7. Responsive Behavior
* **Desktop**: Dashboard uses a sidebar for navigation; post grid is 3-columns.
* **Mobile**: Dashboard uses a hamburger menu; post grid collapses to 1-column for readability.