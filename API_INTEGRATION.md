# Basha Khuji API Integration Map

This document maps the React Query hooks and frontend components to their respective Express backend endpoints. All endpoints have been implemented and consumed successfully.

## Auth & Users
| Backend Endpoint | Frontend Hook | Used In Component |
|-----------------|---------------|-------------------|
| `POST /api/user/register` | `useRegister` | `app/(auth)/_components/register-form.tsx` |
| `POST /api/auth/login` | `useLogin` | `app/(auth)/_components/login-form.tsx` |
| `POST /api/auth/refresh-token` | N/A (Axios Interceptor) | `lib/api.ts` (Runs automatically on 401s) |
| `POST /api/auth/logout` | `useLogout` | `components/shared/navbar.tsx` |
| `GET /api/auth/me` | `useCurrentUser` | `components/shared/navbar.tsx`, `role-guard.tsx` |
| `PATCH /api/user/my-profile` | `useUpdateProfile` | `app/dashboard/(landlord/tenant)/profile/page.tsx` |

## Landlord APIs
| Backend Endpoint | Frontend Hook | Used In Component |
|-----------------|---------------|-------------------|
| `POST /api/landlord/properties` | `useCreateProperty` | `app/dashboard/landlord/properties/new/page.tsx` |
| `PUT /api/landlord/properties/:id` | `useUpdateProperty` | `app/dashboard/landlord/properties/[id]/edit/page.tsx` |
| `PATCH /api/landlord/properties/:id` | `useDeleteProperty` | `app/dashboard/landlord/properties/_components/landlord-properties-client.tsx` |
| `GET /api/landlord/requests` | `useLandlordRequests` | `app/dashboard/landlord/requests/_components/landlord-requests-client.tsx` |
| `PATCH /api/landlord/requests/:id`| `useUpdateLandlordRequest` | `app/dashboard/landlord/requests/_components/landlord-requests-client.tsx` |
| `GET /api/landlord/my-properties` | `useMyProperties` | `app/dashboard/landlord/properties/_components/landlord-properties-client.tsx` |
| `GET /api/landlord/tenant-history/:id`| `useTenantRequestHistory`| `app/dashboard/landlord/requests/_components/landlord-requests-client.tsx` |

## Tenant APIs
| Backend Endpoint | Frontend Hook | Used In Component |
|-----------------|---------------|-------------------|
| `POST /api/requests` | `useCreateRequest` | `app/(public)/properties/[id]/_components/property-sidebar.tsx` |
| `GET /api/requests` | `useMyRequests` | `app/dashboard/tenant/requests/_components/tenant-requests-client.tsx` |
| `GET /api/requests/:id` | `useRequest` | `app/dashboard/tenant/requests/[id]/pay/page.tsx` |

## Public Properties
| Backend Endpoint | Frontend Hook | Used In Component |
|-----------------|---------------|-------------------|
| `GET /api/properties` | `useProperties` | `app/(public)/properties/page.tsx` (Server), `properties-client.tsx` |
| `GET /api/properties/category` | `useCategories` | `app/_components/hero-search.tsx`, Filters |
| `GET /api/properties/location` | `useLocations` | `app/_components/hero-search.tsx`, Filters |
| `GET /api/properties/:id` | `useProperty` | `app/(public)/properties/[id]/page.tsx` (Server) |

## Payments & Reviews
| Backend Endpoint | Frontend Hook | Used In Component |
|-----------------|---------------|-------------------|
| `POST /api/payments/create` | `useInitiatePayment` | `app/dashboard/tenant/requests/[id]/pay/page.tsx` |
| `GET /api/payments` | (Inline `useQuery`) | `app/dashboard/tenant/payments/_components/tenant-payments-client.tsx` |
| `POST /api/payments/webhook` | N/A (Server-only) | Processed by backend directly from Stripe |
| `POST /api/reviews` | `useCreateReview` | `app/dashboard/tenant/requests/_components/tenant-requests-client.tsx` |

## Admin APIs
| Backend Endpoint | Frontend Hook | Used In Component |
|-----------------|---------------|-------------------|
| `GET /api/admin/users` | `useAdminUsers` | `app/dashboard/admin/users/page.tsx` |
| `PATCH /api/admin/users/:id` | `useUpdateUserStatus` | `app/dashboard/admin/users/page.tsx` |
| `GET /api/admin/rentals` | `useAdminRentals` | `app/dashboard/admin/rentals/page.tsx` |
| `POST /api/admin/categories`| `useCreateCategory` | `app/dashboard/admin/categories/page.tsx` |
