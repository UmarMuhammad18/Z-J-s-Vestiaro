# Z&J's Vestiaro

This workspace is organized into two main folders:

- `backend/` — Node.js Express API and backend application files
- `frontend/` — Static website assets and frontend pages

## How to use

### Backend
1. Open `backend/`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure credentials
4. Start the server:
   - `npm run dev` for development
   - `npm start` for production

### Frontend
- Open `frontend/index.html` in your browser for the main multipage frontend.
- Use `frontend/README-FRONTEND.md` for frontend documentation and usage.
- A standalone single-page version is available at `frontend/single-page/index.html`.

## Project structure

- `backend/` contains API routes, controllers, middleware, utilities, and backend docs.
- `frontend/` contains HTML pages, styles, JavaScript, and frontend guides.

## Notes
- The backend uses Express, Supabase, and Stripe integration.
- The frontend is a luxury fashion storefront with shopping and checkout pages.
