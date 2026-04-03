# Google Authentication Setup (Supabase)

To enable Google Sign-In as implemented in this dashboard, follow these steps in the Supabase Dashboard:

## 1. Google Cloud Console Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Search for "APIs & Services" > "OAuth consent screen".
4. Set up the consent screen (choose "External" for User Type).
5. Add "User info" scopes (email, profile).
6. Go to "Credentials" > "Create Credentials" > "OAuth client ID".
7. Select "Web application".
8. **IMPORTANT**: In "Authorized redirect URIs", add your Supabase project callback URL:
   `https://[YOUR_PROJECT_REF].report/auth/v1/callback`
9. Copy your **Client ID** and **Client Secret**.

## 2. Supabase Dashboard Setup
1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Go to "Authentication" > "Providers".
3. Toggle "Google" to ON.
4. Paste your **Client ID** and **Client Secret** from the Google Cloud Console.
5. Save the configuration.

## 3. Environment Variables
Ensure your `.env` file has the correct Supabase URL and Anon Key:
```env
VITE_SUPABASE_URL=https://[YOUR_PROJECT_REF].report
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

## 4. How it works
- The `LoginPage.jsx` uses `signInWithGoogle` from the store.
- `App.jsx` listens for auth state changes via `supabase.auth.onAuthStateChange`.
- When logged in, the `user` object is populated and the full dashboard is revealed.
- User profile data (Name, Avatar, Email) is displayed in the Navbar.
