# Basha Khuji Frontend — Implementation Plan (v2)

## Overview

Build a modern, premium Next.js 16 frontend for the **Basha Khuji** rental property marketplace. The app connects to the existing Express + Prisma backend at `https://basha-khuji-backend.vercel.app/` with JWT auth, Stripe payments, and role-based access for **Tenant**, **Landlord**, and **Admin** users.

---

## Decisions (Resolved)

| Decision | Resolution |
|----------|-----------|
| Backend API URL | `https://basha-khuji-backend.vercel.app` (Vercel production) |
| UI Library | **shadcn/ui** with Tailwind v4 |
| Dark/Light Mode | ✅ Implement with `next-themes` |
| Image Uploads | **ImgBB** API for landlord property images |
| Global State | **Zustand** for auth user state + **TanStack Query** for server state |
| Admin Credentials | Not a concern for now |
| Stripe Flow | Server-side Checkout Sessions — frontend only redirects to `checkoutUrl` from backend. No client-side Stripe.js needed. |

---

## Tech Stack & Dependencies

| Package | Purpose |
|---------|---------|
| `next@16` (existing) | Framework, App Router, Server Components |
| `react@19` (existing) | UI Library |
| `tailwindcss@4` (existing) | Styling |
| **`shadcn/ui`** | Premium UI component library |
| **`@tanstack/react-query`** | Server state, caching, mutations, optimistic updates |
| **`react-hook-form`** | Form state management |
| **`zod`** | Schema validation (mandatory requirement) |
| **`@hookform/resolvers`** | Connect Zod to React Hook Form |
| **`zustand`** | Lightweight auth state store |
| **`lucide-react`** | Icons (comes with shadcn) |
| **`sonner`** | Toast notifications (shadcn-compatible) |
| **`js-cookie`** + `@types/js-cookie` | Client-side cookie management for JWT |
| **`date-fns`** | Date formatting |
| **`next-themes`** | Dark/light mode toggle |
| **`axios`** | HTTP client with interceptors for token refresh |

---

## Proposed Changes

### Phase 1: Project Foundation & Configuration

#### [NEW] `.env.local`
```env
NEXT_PUBLIC_API_URL=https://basha-khuji-backend.vercel.app
NEXT_PUBLIC_APP_NAME=Basha Khuji
NEXT_PUBLIC_IMGBB_API_KEY=<user_provides>
```

#### [MODIFY] [next.config.ts](file:///d:/Full%20Stack/2025%20Recap/Level%202/Basha%20Khuji/basha-khuji-client/next.config.ts)
- Configure `images.remotePatterns` for `picsum.photos`, `i.ibb.co`, and other image domains
- Configure any rewrites needed

#### [MODIFY] [package.json](file:///d:/Full%20Stack/2025%20Recap/Level%202/Basha%20Khuji/basha-khuji-client/package.json)
- Install all dependencies listed above

#### [NEW] `components.json`
- Initialize shadcn/ui configuration for Tailwind v4

#### [MODIFY] [globals.css](file:///d:/Full%20Stack/2025%20Recap/Level%202/Basha%20Khuji/basha-khuji-client/app/globals.css)
- shadcn CSS variables and design tokens
- Premium color palette with dark/light theme support
- Custom animations and micro-interactions

---

### Phase 2: Core Infrastructure

#### [NEW] `lib/api.ts`
Centralized Axios API client:
- Base URL from `NEXT_PUBLIC_API_URL`
- Request interceptor: auto-attach `accessToken` from cookies to `Authorization` header
- Response interceptor: on 401 → attempt token refresh via `/api/auth/refresh-token` → retry original request
- Typed helper functions (`apiGet<T>`, `apiPost<T>`, etc.)

#### [NEW] `lib/auth.ts`
Auth utilities:
- `login()`, `register()`, `logout()`, `refreshToken()`, `getCurrentUser()`
- Cookie helpers: `getAccessToken()`, `setTokens()`, `clearTokens()`

#### [NEW] `lib/imgbb.ts`
ImgBB upload utility:
- `uploadImage(file: File): Promise<string>` — uploads to ImgBB, returns URL
- Error handling for upload failures

#### [NEW] `lib/validations/`
Zod schemas per feature:
- `auth.ts` — `loginSchema`, `registerSchema` (with role selection, confirm password)
- `property.ts` — `createPropertySchema`, `updatePropertySchema`
- `rental.ts` — `rentalRequestSchema`
- `review.ts` — `reviewSchema` (rating 1-5, review text)
- `profile.ts` — `profileUpdateSchema`
- `category.ts` — `categorySchema`

#### [NEW] `types/index.ts`
TypeScript interfaces matching backend response shapes:
- `User`, `Property`, `Category`, `Location`, `RentalRequest`, `Payment`, `Review`
- `ApiResponse<T>`, `PaginatedResponse<T>`, `Meta`
- Enums: `UserRole`, `UserStatus`, `RentalRequestStatus`, `PaymentStatus`

#### [NEW] `store/auth-store.ts`
Zustand store:
```ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}
```

#### [NEW] `providers/`
- `query-provider.tsx` — TanStack Query `QueryClientProvider` wrapper
- `theme-provider.tsx` — `next-themes` `ThemeProvider` wrapper
- `auth-provider.tsx` — On mount: reads cookie → fetches `/api/auth/me` → populates Zustand store

---

### Phase 3: Shared Components

#### [NEW] `components/ui/` (via `npx shadcn@latest add`)
Components to install: `button`, `input`, `label`, `select`, `dialog`, `card`, `badge`, `table`, `dropdown-menu`, `avatar`, `skeleton`, `separator`, `sheet`, `tabs`, `textarea`, `tooltip`, `sonner`, `form`, `switch`, `slider`

#### [NEW] `components/shared/`

| Component | Description |
|-----------|-------------|
| `navbar.tsx` | Responsive top nav — logo, nav links (role-aware), auth buttons or user avatar dropdown, mobile Sheet menu, theme toggle |
| `footer.tsx` | Site footer with links and copyright |
| `hero-section.tsx` | Landing page hero with animated gradient, search bar overlay |
| `property-card.tsx` | Card: image, price badge, location, category, bedrooms, sqft, amenities preview |
| `status-badge.tsx` | Color-coded: PENDING→amber, APPROVED→blue, REJECTED→red, ACTIVE→emerald, COMPLETED→slate |
| `loading-skeleton.tsx` | Skeleton variants for property grid, tables, detail pages |
| `empty-state.tsx` | "No data" illustration with message and optional CTA |
| `confirm-dialog.tsx` | Reusable "Are you sure?" dialog |
| `pagination.tsx` | Page navigation for property lists and tables |
| `image-upload.tsx` | ImgBB drag-and-drop/click image uploader with preview |
| `stats-card.tsx` | Dashboard stat card with icon, label, value |
| `dashboard-sidebar.tsx` | Collapsible sidebar with role-specific nav items |
| `dashboard-header.tsx` | Dashboard top bar with user info and breadcrumbs |

---

### Phase 4: Authentication & Middleware

#### [NEW] `app/auth/layout.tsx`
Split layout — decorative brand panel on left, form on right (desktop), stacked on mobile

#### [NEW] `app/login/page.tsx`
- Email + password fields with `react-hook-form` + `loginSchema`
- Inline Zod error messages
- Toast on success/failure
- "Don't have an account?" link → register

#### [NEW] `app/register/page.tsx`
- Name, email, password, confirm password fields
- **Role selection** via visual card toggle (Tenant vs Landlord)
- `registerSchema` Zod validation
- Toast on success → redirect to login

#### [NEW] `middleware.ts`
Next.js Middleware for route protection:
- Read `accessToken` from cookies
- Decode JWT payload (without verification — verification happens server-side)
- Route guards:
  - `/dashboard/tenant/*` → role must be `TENANT`
  - `/dashboard/landlord/*` → role must be `LANDLORD`
  - `/dashboard/admin/*` → role must be `ADMIN`
- Unauthenticated → redirect to `/login`
- Authenticated users on `/auth/*` → redirect to their dashboard

---

### Phase 5: Public Pages

#### [MODIFY] `app/page.tsx` (Home)
Complete redesign:
- **Hero section** — gradient/mesh background, tagline "Find your perfect rental home", search bar
- **Featured properties** — latest 6 from `GET /api/properties?limit=6`
- **Browse by category** — category cards from `GET /api/properties/category`
- **How it works** — 3-step visual guide (Browse → Request → Move In)
- **CTA banner** — "Are you a landlord? List your property today"

#### [NEW] `app/properties/page.tsx`
Property browse:
- **Filter panel** (sidebar on desktop, Sheet on mobile): searchTerm, categoryName dropdown, locationName, minPrice/maxPrice sliders, minBedrooms, sort controls
- **Property grid** with responsive columns (1/2/3 cols)
- **Pagination** using `meta` from API response
- Filters synced to URL `searchParams` for shareability
- Loading skeletons via `loading.tsx`

#### [NEW] `app/properties/[id]/page.tsx`
Property details:
- Image gallery (grid layout for multiple images)
- Property info: name, price (formatted as ৳), location badge, category badge
- Description section
- Amenities list with icons
- Specs: bedrooms, sqft, vacant from date
- Landlord info card (name, email)
- **"Request to Rent" CTA** — opens dialog with message field (for logged-in tenants), login prompt for guests

#### [NEW] `app/properties/loading.tsx` & `app/properties/[id]/loading.tsx`
Skeleton loaders

---

### Phase 6: Tenant Dashboard

#### [NEW] `app/dashboard/tenant/page.tsx`
Overview: stats cards (total requests, approved count, active rentals) + recent requests table

#### [NEW] `app/dashboard/tenant/requests/page.tsx`
Full request history table:
- Columns: property name, status badge, submitted date, actions
- **"Pay Now"** button on `APPROVED` rows → navigates to payment page
- **"Leave Review"** button on `ACTIVE`/`COMPLETED` rows → opens review dialog

#### [NEW] `app/dashboard/tenant/requests/[id]/pay/page.tsx`
Payment initiation:
- Request + property details summary
- Amount display (formatted ৳)
- **"Proceed to Payment"** button → `POST /api/payments/create` → redirect to Stripe `checkoutUrl`
- Loading state during API call

#### [NEW] `app/payment/success/page.tsx`
- Success animation (checkmark)
- "Payment Confirmed" message
- Calls `POST /api/payments/confirm` with `transactionId` from URL search params (belt-and-suspenders confirmation alongside webhook)
- "Back to Dashboard" link

#### [NEW] `app/payment/cancel/page.tsx`
- Warning illustration
- "Payment was cancelled" message
- "Try Again" + "Back to Dashboard" links

#### [NEW] `app/dashboard/tenant/payments/page.tsx`
Payment history table: transaction ID, amount, status, date, property name

#### [NEW] `app/dashboard/tenant/profile/page.tsx`
Edit profile form: name, phone, occupation, address, profile image (ImgBB upload)

#### [NEW] `app/dashboard/layout.tsx`
Dashboard shell:
- Collapsible sidebar with role-aware nav items
- Top header with user avatar, name, and breadcrumbs
- Main content area
- Mobile: sidebar becomes a Sheet overlay

---

### Phase 7: Landlord Dashboard

#### [NEW] `app/dashboard/landlord/page.tsx`
Overview: stats (total properties, pending requests, approved requests) + recent activity

#### [NEW] `app/dashboard/landlord/properties/page.tsx`
Properties table/grid:
- Each property card/row: name, price, location, availability status, actions (Edit, Delete)
- "Add New Property" button

#### [NEW] `app/dashboard/landlord/properties/new/page.tsx`
Create property form:
- **Category** dropdown (from `GET /api/properties/category`)
- **Location** text input (backend creates location if new)
- Name, price, address, description (textarea)
- **Amenities** — tag input or multi-select checkboxes
- **Vacant from** — date input
- **Images** — ImgBB uploader (multiple images, drag-and-drop, preview thumbnails)
- Bedroom count, square footage
- Full Zod validation via `createPropertySchema`
- Toast on success → redirect to properties list

#### [NEW] `app/dashboard/landlord/properties/[id]/edit/page.tsx`
Edit property form — pre-populated with existing data, same layout as create

#### [NEW] `app/dashboard/landlord/requests/page.tsx`
Incoming requests table:
- Columns: tenant name, tenant email, property, message preview, status, date, actions
- **"Approve"** / **"Reject"** buttons with confirmation dialog
- Toast notification on success
- Optimistic update via TanStack Query `onMutate`

---

### Phase 8: Admin Dashboard

#### [NEW] `app/dashboard/admin/page.tsx`
Platform overview: stats cards (total users, total properties, pending requests, active rentals)

#### [NEW] `app/dashboard/admin/users/page.tsx`
User management table:
- Columns: name, email, role badge, status badge, joined date, actions
- **"Ban"** / **"Unban"** toggle with confirmation dialog
- Search/filter by role or status

#### [NEW] `app/dashboard/admin/rentals/page.tsx`
All platform rentals table:
- Columns: tenant, property, landlord (from property.userId), status, dates
- Filter by status

#### [NEW] `app/dashboard/admin/categories/page.tsx`
Category management:
- List of existing categories
- "Add Category" inline form with Zod validation

---

### Phase 9: Error Handling & Edge Cases

#### [NEW] `app/not-found.tsx`
Custom 404 page — illustration, "Page not found" message, "Go Home" link

#### [NEW] `app/error.tsx`
Global error boundary — error message, "Try Again" button

#### [NEW] `app/dashboard/error.tsx`
Dashboard error boundary

#### [NEW] `app/properties/error.tsx`
Properties error boundary

---

### Phase 10: TanStack Query Hooks

#### [NEW] `hooks/use-auth.ts`
- `useLogin()` mutation — calls login API, sets cookies, updates Zustand store
- `useRegister()` mutation
- `useLogout()` mutation — clears cookies, clears Zustand store
- `useCurrentUser()` query — fetches `/api/auth/me`, populates Zustand

#### [NEW] `hooks/use-properties.ts`
- `useProperties(filters)` — paginated, filterable property list
- `useProperty(id)` — single property detail
- `useCategories()` — all categories
- `useCreateProperty()`, `useUpdateProperty(id)`, `useDeleteProperty(id)` mutations

#### [NEW] `hooks/use-requests.ts`
- `useTenantRequests()` — tenant's own rental requests
- `useLandlordRequests()` — landlord's incoming requests
- `useCreateRequest()` — submit rental request
- `useUpdateRequestStatus(id)` — approve/reject (landlord)

#### [NEW] `hooks/use-payments.ts`
- `usePaymentHistory()` — tenant's payments
- `usePaymentDetails(id)` — single payment
- `useCreatePaymentSession()` — initiate Stripe checkout (returns `checkoutUrl`)
- `useConfirmPayment()` — manual confirmation with `transactionId`

#### [NEW] `hooks/use-reviews.ts`
- `useCreateReview()` mutation

#### [NEW] `hooks/use-admin.ts`
- `useAllUsers()` — all users (admin)
- `useUpdateUserStatus(id)` — ban/unban
- `useAllRentals()` — all platform rentals
- `useCreateCategory()` — add category

#### [NEW] `hooks/use-profile.ts`
- `useUpdateProfile()` mutation

---

### Phase 11: Documentation

#### [NEW] `API_INTEGRATION.md`
Mapping document (mandatory requirement):

| Frontend Component | Backend Endpoint | Method |
|--------------------|------------------|--------|
| Home page (featured) | `/api/properties?limit=6` | GET |
| Property browse | `/api/properties` | GET |
| Property details | `/api/properties/:id` | GET |
| Category filter | `/api/properties/category` | GET |
| Login form | `/api/login` | POST |
| Register form | `/api/user/register` | POST |
| Auth check | `/api/auth/me` | GET |
| Token refresh | `/api/auth/refresh-token` | POST |
| Logout | `/api/auth/logout` | POST |
| Profile update | `/api/user/my-profile` | PATCH |
| Submit request | `/api/requests` | POST |
| Tenant requests | `/api/requests` | GET |
| Request details | `/api/requests/:id` | GET |
| Create payment | `/api/payments/create` | POST |
| Confirm payment | `/api/payments/confirm` | POST |
| Payment history | `/api/payments` | GET |
| Payment details | `/api/payments/:id` | GET |
| Create review | `/api/reviews` | POST |
| Create property | `/api/landlord/properties` | POST |
| Update property | `/api/landlord/properties/:id` | PUT |
| Delete property | `/api/landlord/properties/:id` | PATCH |
| Landlord properties | `/api/landlord/my-properties` | GET |
| Landlord requests | `/api/landlord/requests` | GET |
| Update request status | `/api/landlord/requests/:id` | PATCH |
| Admin users | `/api/admin/users` | GET |
| Admin ban/unban | `/api/admin/users/:id` | PATCH |
| Admin rentals | `/api/admin/rentals` | GET |
| Admin create category | `/api/admin/categories` | POST |

---

## Project File Structure

```
basha-khuji-client/
├── app/
│   ├── layout.tsx                 # Root layout (providers, fonts, navbar, footer)
│   ├── page.tsx                   # Home page
│   ├── not-found.tsx              # 404
│   ├── error.tsx                  # Global error boundary
│   ├── globals.css                # Design system + shadcn tokens
│   ├── auth/
│   │   ├── layout.tsx             # Auth split layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── properties/
│   │   ├── page.tsx               # Browse & filter
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [id]/
│   │       ├── page.tsx           # Property details
│   │       └── loading.tsx
│   ├── dashboard/
│   │   ├── layout.tsx             # Dashboard shell (sidebar + header)
│   │   ├── error.tsx
│   │   ├── tenant/
│   │   │   ├── page.tsx           # Overview
│   │   │   ├── requests/
│   │   │   │   ├── page.tsx       # Request history
│   │   │   │   └── [id]/pay/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── landlord/
│   │   │   ├── page.tsx           # Overview
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx       # My properties
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── requests/page.tsx
│   │   └── admin/
│   │       ├── page.tsx           # Overview
│   │       ├── users/page.tsx
│   │       ├── rentals/page.tsx
│   │       └── categories/page.tsx
│   └── payment/
│       ├── success/page.tsx
│       └── cancel/page.tsx
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   └── shared/                    # Custom shared components
├── hooks/                         # TanStack Query hooks
├── lib/
│   ├── api.ts                     # Axios client + interceptors
│   ├── auth.ts                    # Auth utilities
│   ├── imgbb.ts                   # ImgBB upload helper
│   ├── utils.ts                   # cn() + general utils
│   └── validations/               # Zod schemas
├── providers/                     # QueryProvider, ThemeProvider, AuthProvider
├── store/
│   └── auth-store.ts              # Zustand auth store
├── types/
│   └── index.ts                   # TypeScript interfaces & enums
├── middleware.ts                  # Next.js route protection
├── .env.local
└── API_INTEGRATION.md
```

---

## Execution Order

1. **Phase 1** — Foundation (deps, config, shadcn init, globals.css)
2. **Phase 2** — Core infra (API client, types, Zustand, validations, providers)
3. **Phase 3** — Shared components (navbar, footer, cards, badges, sidebar)
4. **Phase 4** — Auth (login, register, middleware)
5. **Phase 5** — Public pages (home, properties browse, property detail)
6. **Phase 6** — Tenant dashboard (requests, payments, reviews, profile)
7. **Phase 7** — Landlord dashboard (property CRUD, request management)
8. **Phase 8** — Admin dashboard (users, rentals, categories)
9. **Phase 9** — Error pages (404, error boundaries)
10. **Phase 10** — TanStack Query hooks (built alongside phases 5-8, listed separately for clarity)
11. **Phase 11** — Documentation (`API_INTEGRATION.md`)

---

## Verification Plan

### Automated
- `npm run build` — zero TypeScript/build errors
- `npm run lint` — ESLint clean

### Manual
1. **Auth**: Register → Login → Protected routes → Logout → Redirect behavior
2. **Public**: Home → Properties browse → Filter/sort → Property details
3. **Tenant**: Submit request → View in dashboard → Pay (Stripe redirect) → Success page → Leave review
4. **Landlord**: Create property (with ImgBB images) → View properties → Approve/reject requests
5. **Admin**: View users → Ban/unban → View all rentals → Create category
6. **Error handling**: 404 page, API error toasts, form validation display
7. **Responsive**: Mobile / tablet / desktop
8. **Dark/Light**: Toggle and verify all pages
