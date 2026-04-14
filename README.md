# Job Application Portal (React + MongoDB)

A simple job application app with:
- Public job listing and filtering
- Job details page
- Application form submission
- Basic admin login
- Admin job create/update/delete

## Run locally

1. Create the backend env file:

```bash
copy backend/.env.example backend/.env
```

2. Update `backend/.env` with your MongoDB Atlas connection string.
   The example file also includes an optional direct-host URI fallback for environments where SRV DNS lookups fail.

3. Start API server:

```bash
npm run server
```

4. Start React app in a second terminal:

```bash
npm start
```

5. Open `http://localhost:3000`

## Admin credentials

- Email: `admin@jobboard.com`
- Password: `admin123`

The backend seeds the initial jobs and admin user from `backend/db.json` the first time it connects to an empty database.

## Project structure

- `src/components/common` shared UI components
- `src/components/jobs` job listing/detail components
- `src/components/applications` application flow components
- `src/components/admin` admin components
- `src/pages` route pages
- `src/context` global state providers
- `src/hooks` custom hooks for contexts
- `src/services/api.js` API integration
- `backend/server.js` Express + MongoDB API
- `backend/db.json` seed data
