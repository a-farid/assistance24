# Project Context for Assistance24

## Overview
This project is a client-worker relationship management platform built with:
- Backend: **FastAPI** (Python)
- Frontend: **Next.js 15** with **React 19**
- UI: **Tailwind CSS**, **Material UI**, **Radix UI**, and custom components
- Database: **SQLite** (development mode via SQLAlchemy, async)
- Caching / session-like storage: **Redis**
- Email: **FastAPI-Mail** with Jinja templates
- Push notifications: **Firebase Cloud Messaging (FCM)**

The app supports roles and workflows for:
- `admin`
- `worker`
- `client`

It also includes authentication, email/password reset flows, notifications, contracts, meetings, and user management.

---

## Backend Structure

### `backend/main.py`
- Application entry point.
- Uses an async lifespan hook to create or verify the database at startup.
- Registers routes, middleware, and error handlers.
- Root API path is mounted under `/api`.

### `backend/routers/`
Contains the main API route groups:
- `auth_routes.py` — login, signup, logout, refresh, password reset, token management
- `user_routes.py` — user CRUD and profile operations
- `contract_routes.py` — contract management between clients and workers
- `meeting_routes.py` — meeting entries, time tracking, statuses
- `notification_routes.py` — notifications API
- `images_routes.py` — image upload / retrieval (not included in OpenAPI schema)

### `backend/database/`
- `Db_BaseModel.py` — custom async SQLAlchemy base model and helper methods
- `models.py` — data models for:
  - `User`
  - `Client`
  - `Worker`
  - `Contract`
  - `Meeting`
  - `Notification`
  - `FCMToken`
- `db_services.py` — generic database service wrapper for CRUD and pagination
- `firebase_utils.py` — Firebase initialization and FCM push notification helper

### `backend/services/`
- `auth_svc.py` — authentication operations, user creation, password reset, FCM token storage, Redis caching
- `jwt_svc.py` — JWT creation, validation, refresh tokens, authorization helpers
- `contract_svc.py`, `meeting_svc.py`, `notification_svc.py`, `user_svc.py` — service logic for domain operations (not fully inspected here but follow the same pattern)

### `backend/schemas/`
Contains Pydantic schemas for request/response validation, including user, contract, meeting, notification, and authentication payloads.

### `backend/settings/`
- `config.py` — environment variables and global settings using `pydantic_settings`
- `mail.py` — email sending helper and templates for verification/reset flows
- `middleware.py` — CORS, trusted hosts, and request logging
- `standarization.py` — response formatting utilities

### Important backend details
- Database currently uses `sqlite+aiosqlite` in `backend/database/Db_BaseModel.py`
- There is also Redis used for caching user data and session-like state
- Email verification uses HMAC and token expiry checks
- Password reset uses JWT-based tokens and email delivery
- An admin secret key is required for creating admin users

---

## Frontend Structure

### `frontend/package.json`
Key dependencies:
- `next` 15
- `react` 19
- `@reduxjs/toolkit`, `react-redux`
- `axios`
- `next-intl` for internationalization
- `next-themes` for theme switching
- `tailwindcss` 4
- `@mui/material`, `@radix-ui/react-*`
- `socket.io-client`
- `zod` for validation

### `frontend/src/app/layout.tsx`
- Sets metadata and global layout
- Provides theme, Redux, toast notifications, and `next-intl` localization support
- Uses custom Google fonts and a dark-mode-ready body class layout

### `frontend/src/app/globals.css`
- Tailwind CSS configuration and custom theme variables
- Includes responsive layout helpers and dark mode design tokens

### `frontend/src/components/`
- Organized into auth, layout, providers, shared UI components, and more
- `providers/redux-provider.tsx` likely wraps app with Redux store
- `providers/theme-provider.tsx` handles theme switching
- `providers/toaster-provider.tsx` handles toast messages
- There is a `Protected` hook for protected route behavior

### `frontend/src/i18n/`
- Handles locale configuration and locale-aware requests
- `messages/en.json` and `messages/de.json` are present for translations

---

## What the app does now

The existing codebase implements a working platform for managing:
- user registration and login
- email verification and password reset
- role-based access control
- contracts between clients and workers
- meeting/hour tracking with status values (`pending`, `accepted`, `rejected`)
- notification creation and push delivery via FCM
- profile images / media routes
- localized frontend experience with English and German

---

## What to look at first when continuing work

1. `backend/main.py` and `backend/routers/auth_routes.py`
   - Verify the auth flow and token cookies
2. `backend/database/Db_BaseModel.py`
   - Confirm whether you want to keep SQLite or move to PostgreSQL
3. `backend/settings/config.py`
   - Set up `.env` values before running locally
4. `frontend/src/app/layout.tsx`
   - Confirm layout/provider setup and localization behavior
5. `frontend/src/components/_hooks/Protected.tsx`
   - Verify how frontend route protection works and how it uses cookies / auth state
6. `frontend/src/lib/hooks.ts` and `frontend/src/services/session.ts`
   - Check how auth tokens and session state are stored client-side

---

## Gotchas and cleanup notes

- The frontend README is still the default/example placeholder from a Next.js/next-intl sample and does not describe the real app.
- `backend/database/serviceAccountKey.json` and `backend/serviceAccountKey.json` hold Firebase credentials. Keep them secure and do not commit to public repositories.
- The app uses both Firebase push notifications and email flows; if you restart development, confirm that the Mail server and Firebase service account are valid.
- CORS is configured only for `localhost:3000`, so adjust it if you host the frontend elsewhere.

---

## Recommended next step

1. Create a `.env` file in `backend/` matching `backend/settings/config.py` variables.
2. Run the backend locally with `uvicorn backend.main:app --reload` or equivalent.
3. Start the frontend with `npm install` and `npm run dev` inside `frontend/`.
4. Test the login/signup flow and contract/meeting APIs.

---

## Useful files for future reference
- `backend/main.py`
- `backend/routers/auth_routes.py`
- `backend/database/models.py`
- `backend/database/Db_BaseModel.py`
- `backend/services/auth_svc.py`
- `backend/settings/mail.py`
- `frontend/src/app/layout.tsx`
- `frontend/package.json`
- `frontend/src/components/providers/redux-provider.tsx`
- `frontend/src/components/_hooks/Protected.tsx`
- `frontend/src/i18n/config.ts`

---

If you want, I can also add a small `START_HERE.md` or update the existing `README.md` to reflect the current state and best next tasks.