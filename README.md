# Job Application Portal (React + JSON Server)

A simple job application app with:
- Public job listing and filtering
- Job details page
- Application form submission
- Basic admin login
- Admin job create/update/delete

## Run locally

1. Start API server:

```bash
npx json-server --watch backend/db.json --port 5000 --routes backend/routes.json
```

2. Start React app:

```bash
npm start
```

3. Open `http://localhost:3000`

## Admin credentials

- Email: `admin@jobboard.com`
- Password: `admin123`

## Project structure

- `src/components/common` shared UI components
- `src/components/jobs` job listing/detail components
- `src/components/applications` application flow components
- `src/components/admin` admin components
- `src/pages` route pages
- `src/context` global state providers
- `src/hooks` custom hooks for contexts
- `src/services/api.js` API integration
- `backend/db.json` JSON Server data
