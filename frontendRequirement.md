# Assignment 5 - Frontend Project 


## ⚠️ Mandatory Requirements

> [!CAUTION]
> **MANDATORY - READ CAREFULLY**
> 
> The following **SIX requirements are MANDATORY**:
> 1. **API Integration & Documentation** - Consume all required backend endpoints. Provide a brief `API_INTEGRATION.md` file mapping frontend components to backend endpoints.
> 2. **Consistent UI Error Handling** - All API errors and form validation errors must show user-friendly, structured UI feedback (e.g., Toast notifications, inline form errors, Error Boundaries).
> 3. **Commits** - 20 meaningful *frontend* commits with descriptive messages (e.g., `feat: add role-based dashboard layout`, `fix: resolve stripe checkout redirect loop`).
> 4. **Form Validation** - Client-side validation on all forms using **Zod + React Hook Form** (or Next.js Server Actions with Zod), with clear error messages.
> 5. **Admin Credentials** - Provide working admin email & password to test the deployed frontend application.
> 6. **Payment Integration** - Must integrate the frontend flow for **Stripe** (Checkout/Elements) or **SSLCommerz**. Simulated/fake payments (Cash on Delivery, Pay Later) are **NOT** accepted. Must handle success/cancel redirect pages.
>
> ❌ **Failure to complete any of these = 0 MARKS**

---

## 📊 Marks Distribution

| # | Category | Weight | Details |
|:-:|----------|:------:|---------|
| 1 | UI/UX Design & Responsiveness | 20% | Modern, clean UI, mobile-first responsive design, loading skeletons, toast messages, dark/light mode (optional but bonus) |
| 2 | State Management & Data Fetching | 20% | Proper use of Next.js App Router (Server/Client Components), TanStack Query (or SWR), and global state (Zustand/Context) where appropriate |
| 3 | Commit History | 10% | 20 meaningful frontend commits with conventional commit standards |
| 4 | Error Handling & Validation | 10% | Zod validation, React Hook Form, UI error boundaries, graceful 404/500 pages |
| 5 | Core Functionality | 20% | Auth flows (JWT storage, protected routes via Middleware), role-based UI rendering, full CRUD via UI |
| 6 | Payment Integration | 10% | Frontend payment flow (Stripe Checkout/SSLCommerz redirect), handling success/failure routes, updating UI post-payment |
| 7 | Video Explanation | 10% | 7-10 min frontend walkthrough video |

---


## 📦 What to Submit

| Item | Required |
|------|:--------:|
| Frontend GitHub Repo |
| Live Frontend URL (Vercel) |
| Backend API URL (Your own or provided) |
| Demo Video (7-10 min) |
| Admin Credentials |

**Example:**
```text
Frontend Repo    : https://github.com/your-username/rentnest-frontend
Live Frontend    : https://rentnest-app.vercel.app
Backend API      : https://rentnest-api.vercel.app (or mock data setup)
Demo Video       : https://drive.google.com/file/d/xxx/view
Admin Email      : admin@rentnest.com
Admin Password   : admin123
```

---

## 🎥 Video Explanation Guide

**Language:** English or Bengali

**What to Cover:**
1. Project overview & Next.js architecture (App Router, folder structure).
2. Demonstrate all 3 roles working via the **actual UI** (Customer/Tenant, Provider/Landlord/Technician, Admin). Show how the UI adapts per role.
3. Show CRUD operations via the UI (e.g., creating an item, updating status, deleting).
4. Demonstrate form validation (show an error triggering) and error handling (e.g., network error toast).
5. Walk through the Payment Integration flow (from clicking "Pay" to the success page).
6. Briefly explain one technical challenge you solved (e.g., middleware auth, state management, payment webhook handling).

**Recording Options:**
- **Loom** - Record & share link directly.
- **OBS** - Record & upload to Google Drive (set "Anyone with link" access).

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js** (App Router) | React Framework, Routing, Server Components |
| **TypeScript** | Type safety (Mandatory) |
| **Tailwind CSS** | Styling (Shadcn UI, DaisyUI, or custom components allowed) |
| **React Hook Form + Zod** | Form state management and schema validation |
| **Fetch**, **TanStack Query (React Query)** or **SWR** | Server state management and data fetching |
| **Auth.js** or **Custom JWT Middleware** | Authentication and protected routes |
| **Stripe.js** or **SSLCommerz JS** | Frontend payment gateway integration |

### Deployment
| Service | Purpose |
|---------|---------| 
| **Vercel/Render** | Frontend application deployment (Recommended) |

---

## 🎯 Key Rules

- **Roles**: Each project has 3 fixed roles. The UI must dynamically render navigation, dashboards, and actions based on the authenticated user's role. Use Next.js Middleware for route protection.
- **Payment**: Payment integration is **MANDATORY**. The frontend must successfully initiate the payment (e.g., redirect to Stripe Checkout or SSLCommerz gateway) and handle the return URL (success/cancel pages) gracefully, updating the UI accordingly.
- **Backend Dependency**: You may connect to your own backend from a previous assignment, a partner's backend, or a provided mock backend. If using a mock, document it clearly, but real API integration is highly preferred.
- **Performance**: Optimize images using `next/image`, implement loading states (`loading.tsx`), and handle errors gracefully (`error.tsx`).

---

## ⚠️ Important Notes

> **Plagiarism** = 0 Marks. All UI components, logic, and integrations must be your original work. Using AI to generate entire pages without understanding or customization will result in mark deduction.

**Good luck! Build a blazing-fast, beautiful, and robust Next.js frontend you're proud of.** 🚀



# Assignment 5 - RentNest Frontend 🏠
**"Find & List Rental Properties with Ease"**

---

## Project Overview

RentNest is a modern, responsive **Next.js application** for a rental property marketplace. Landlords can list properties, manage availability, and approve or reject rental requests via an intuitive dashboard. Tenants can browse listings with advanced filtering, submit rental requests, and complete secure payments. Admins oversee the entire platform through a comprehensive moderation dashboard. 

> 💡 **Note**: This is a **frontend-only** assignment. You will consume a backend API (your own from a previous assignment).

> ⚠️ Note: Consider these requirements as a starting guide. Modify, add, or prune features to align with your implementation strategy.

---

## Roles & Permissions

| Role | Description | Frontend UI Expectations |
|------|-------------|-----------------|
| **Tenant** | Users looking for rental properties | Public browsing, interactive request forms, payment checkout flow, review submission, protected tenant dashboard. |
| **Landlord** | Property owners who list rentals | Protected landlord dashboard, property CRUD forms (with image upload UI), request approval/rejection toggles, tenant history views. |
| **Admin** | Platform moderators | Protected admin dashboard, user management tables (ban/unban actions), global platform statistics, content moderation UI. |

> 💡 **Note**: Users select their role during registration. The UI must dynamically adapt based on the authenticated user's role, and routes must be protected using **Next.js Middleware**.

---

## Features & UI/UX Requirements

### Public Features
- **Responsive Property Grid**: Display properties with optimized images (`next/image`), price, location, and basic amenities.
- **Advanced Search & Filter**: Sidebar or top-bar filters for location, price range, property type, and amenities with real-time UI updates.
- **Property Details Page**: Comprehensive view with image gallery, description, landlord info, and a "Request to Rent" call-to-action (CTA).
- **Loading & Error States**: Skeleton loaders for data fetching and graceful `error.tsx` fallbacks.

### Tenant Features
- **Auth Flows**: Registration and login forms with Zod validation and inline error messages.
- **Rental Request Flow**: Interactive form/modal to submit a request. If approved, a clear "Proceed to Payment" CTA.
- **Payment Integration**: Seamless redirect to **Stripe Checkout** or **SSLCommerz** gateway. Dedicated `/payment/success` and `/payment/cancel` pages with clear UI feedback.
- **Tenant Dashboard**: View rental request history (with status badges: Pending, Approved, Rejected, Active), payment history table, and a form to leave reviews after completion.

### Landlord Features
- **Landlord Dashboard**: Overview of total properties, active requests, and earnings.
- **Property Management**: Forms to create, edit, and remove listings. Include UI for image URL uploads and availability toggles.
- **Request Management**: A dedicated table/list to view incoming requests with "Approve" and "Reject" action buttons (triggering toast notifications on success).

### Admin Features
- **Admin Dashboard**: Global overview of platform health (total users, properties, pending requests).
- **User Management**: Data table of all users with search, pagination, and "Ban/Unban" action buttons.
- **Content Moderation**: Views to inspect all listings and rental requests across the platform.

---

## Frontend Routes & API Integration

> ⚠️ **Note**: These are suggested Next.js App Router paths. You must map these to your backend API endpoints.

| Next.js Route | Component/Feature | Backend API Consumption |
|---------------|-------------------|-------------------------|
| `/` | Home page with featured properties | `GET /api/properties` |
| `/properties` | Browse & filter properties | `GET /api/properties`, `GET /api/categories` |
| `/properties/[id]` | Property details & request CTA | `GET /api/properties/:id` |
| `/auth/register` | Role selection & registration form | `POST /api/auth/register` |
| `/auth/login` | Login form | `POST /api/auth/login` |
| `/dashboard/tenant` | Tenant overview & request history | `GET /api/rentals`, `GET /api/payments` |
| `/dashboard/tenant/requests/[id]/pay` | Payment initiation page | `POST /api/payments/create` |
| `/payment/success` & `/payment/cancel` | Payment outcome pages | (Updates UI based on URL params/session) |
| `/dashboard/landlord` | Landlord overview & property list | `GET /api/landlord/properties` |
| `/dashboard/landlord/properties/new` | Create property form | `POST /api/landlord/properties` |
| `/dashboard/landlord/requests` | Manage incoming requests | `GET /api/landlord/requests`, `PATCH /api/landlord/requests/:id` |
| `/dashboard/admin` | Admin overview & user management | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |

---

## Flow Diagrams & UI Considerations

### 🏠 Tenant Journey
```text
[Register/Login] → [Browse Properties] → [View Details] 
       ↓
[Submit Request Form (Zod Validation)] → [Wait for Approval UI]
       ↓
[Approved: "Pay Now" CTA] → [Stripe/SSLCommerz Redirect]
       ↓
[Payment Success Page] → [Leave Review Form]
```
> **UI Focus**: Show loading spinners during form submission. Use toast notifications for success/failure.

### 🏘️ Landlord Journey
```text
[Register/Login] → [Dashboard Overview] → [Create Listing Form]
       ↓
[View Incoming Requests Table] → [Click Approve/Reject]
       ↓
[Toast Notification: "Request Approved"] → [Tenant can now pay]
```
> **UI Focus**: Use optimistic UI updates to instantly reflect status changes in the table without a full page reload.

### 📊 Rental Request Status (UI Badges)
- `PENDING` → Yellow/Orange Badge
- `APPROVED` → Blue Badge (Shows "Pay Now" button)
- `REJECTED` → Red Badge
- `ACTIVE` → Green Badge (Shows "Leave Review" button)
- `COMPLETED` → Gray Badge

---

**Good luck! Build a blazing-fast, accessible, and beautiful Next.js frontend you're proud of.** 🚀