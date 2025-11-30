# Demo Instructions: True Valence Mapper (MVP)

To demonstrate this application to your colleagues, you need to connect it to your Supabase account and run it locally.

## 1. Supabase Setup
Since we are using a real backend for data safety, you need to configure your Supabase project.

1.  **Log in** to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  **Create a new project** (e.g., "True Valence Pilot").
3.  **Get Credentials:**
    -   Go to **Project Settings** -> **API**.
    -   Copy the **Project URL**.
    -   Copy the **anon** public key.

### Database Configuration (SQL)
You need to create the table to store session data. Run this in the Supabase **SQL Editor**:

```sql
-- Create a table to store coaching sessions
create table sessions (
  user_id uuid references auth.users not null primary key,
  data jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- For the Pilot, we'll allow users to see/edit ONLY their own data.
alter table sessions enable row level security;

create policy "Users can view their own session"
  on sessions for select
  using ( auth.uid() = user_id );

create policy "Users can update their own session"
  on sessions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own session"
  on sessions for update
  using ( auth.uid() = user_id );
```

## 2. Local Environment Setup
1.  Navigate to the app directory:
    ```bash
    cd versions/bmad/app
    ```
2.  Create a `.env` file based on the example:
    ```bash
    cp .env.example .env
    ```
3.  **Edit `.env`** and paste your Supabase URL and Key:
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ```

## 3. Running the Demo
1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open the link shown (usually `http://localhost:5173`) in your browser.

## 4. Demo Script (What to Show)
Follow the **Walkthrough** (`docs/bmad/04-verification/walkthrough.md`) to demonstrate the key features:

1.  **Login:** Enter your email. Click the "Magic Link" in your email inbox to log in.
2.  **Mapping:**
    -   Click **"+ Add Person"** to create a node.
    -   Name it "Jane Doe" (Role: Direct Report).
    -   Drag the node to show the physics engine (D3.js).
3.  **Valence:**
    -   Click the line connecting "Me" and "Jane".
    -   Adjust the sliders (Trust, Communication, etc.).
    -   Show how the score is captured.
4.  **Persistence:**
    -   Refresh the page.
    -   Show that "Jane Doe" and her scores are still there (loaded from Supabase).

## 5. Sharing with Colleagues
For a live demo, the easiest way is to:
-   **Share your screen** while running it locally.
-   **Deploy** to Vercel/Netlify (requires adding the same Environment Variables in their dashboard).
