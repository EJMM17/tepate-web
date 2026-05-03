<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/93509c25-496b-4dc7-a791-4d1bffc7a131

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Homepage audit remediation (2026-05-02)
- Added keyboard-accessible desktop dropdown triggers and ARIA state handling.
- Added modal dialog accessibility attributes/focus handling foundations.
- Improved contact form ARIA error semantics and summary alert region.
- Extracted homepage inline CSS to `src/styles/homepage.css`.
- Split `src/main.ts` concerns into `src/scripts/*` modules.
- Tightened homepage font weight requests to reduce payload.

