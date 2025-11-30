# Progress Frontend

## Quick Start

1. Ensure you have node and npm installed
2. Run `npm install`
3. Run `npx tailwindcss -i ./src/input.css -o ./src/index.css --watch` to automatically regenerate the necessary tailwind css classes while developing
4. Run `npm run dev` to spin up the vite development server

## Environment Variables

All environment variables beginning with VITE\_ will be automatically loaded from a .env file for the vite development server. For production, since we are deploying on Vercel, these environment variables need to be configured in the Vercel dashboard.

- VITE_API_URL: the api url of the backend. Use `http://localhost:3000` for development by default.
