# Basha Khuji API Integration Guide

This document summarizes how the Next.js frontend integrates with the Express backend using TanStack React Query and Axios.

## 1. Authentication

The platform uses a token-based authentication system (`accessToken` and `refreshToken`).

- **Axios Interceptors (`lib/api.ts`)**: Automatically attaches the `Bearer` token to every request if the user is authenticated.
- **Refresh Token Rotation**: If a request fails with a 401 Unauthorized error, the interceptor automatically attempts to call `/api/auth/refresh-token`. If successful, the original request is retried with the new token.
- **Client State (`store/auth-store.ts`)**: Zustand handles global state, storing the currently authenticated `User` object so it can be accessed instantly by any component.
- **Hooks (`hooks/use-auth.ts`)**: 
  - `useLogin()`: Logs in, sets cookies, fetches the profile, and updates Zustand.
  - `useRegister()`: Registers a new user.
  - `useLogout()`: Calls the logout endpoint and clears local state and cookies.

## 2. API Endpoints Covered

We have successfully integrated the following routes from the backend API:

### Auth & Users
- `POST /api/user/register` - Create new Tenant/Landlord
- `POST /api/auth/login` - Authenticate
- `POST /api/auth/refresh-token` - Refresh session
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/user/my-profile` - Update user profile

### Properties (Public & Landlord)
- `GET /api/properties` - Browse properties (with filters)
- `GET /api/properties/:id` - View property details
- `GET /api/landlord/my-properties` - View landlord's properties
- `POST /api/landlord/properties` - Create a property
- `PUT /api/landlord/properties/:id` - Update a property
- `PATCH /api/landlord/properties/:id` - Archive a property

### Rental Requests (Tenant & Landlord)
- `POST /api/requests` - Tenant applies for a property
- `GET /api/requests` - Tenant views their applications
- `GET /api/landlord/requests` - Landlord views applications on their properties
- `PATCH /api/landlord/requests/:id` - Landlord approves/rejects an application

### Payments (Tenant)
- `GET /api/payments` - Tenant views payment history
- `POST /api/payments/create-payment` - Tenant initiates payment for an APPROVED request

### Admin Features
- `GET /api/admin/users` - View all users
- `PATCH /api/admin/users/:id` - Ban/Unban user
- `GET /api/admin/rentals` - View all rentals
- `POST /api/admin/categories` - Create new category
- `GET /api/categories` - Fetch public categories
- `GET /api/locations` - Fetch public locations

## 3. Error Handling

- **API Errors**: The backend returns standardized error formats (`{ success: false, message: "..." }`). Axios interceptors reject the promise with these errors.
- **UI Notifications**: React Query's `onError` callbacks use `sonner` toast notifications to display the exact backend error message to the user.
- **Global Errors**: React Error Boundaries (`error.tsx`) catch rendering issues.
- **404 Handling**: A global `not-found.tsx` provides a seamless fallback for broken links.
