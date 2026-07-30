# Basha Khuji 🏠

Basha Khuji is a comprehensive, full-stack real estate and property rental platform. It seamlessly connects landlords looking to rent out their properties with tenants searching for their perfect home, while providing administrators with complete oversight of the entire operation.

Whether it's finding an apartment, managing rental requests, or securely processing rent payments, Basha Khuji handles property listings, secure transactions, user verification, and request tracking all in one place.

## 🔗 Important Links

- **Live Website (Client):** *https://basha-khuji.vercel.app/*
- **Server Repository:** *https://github.com/NahidRuhan/Basha-Khuji-backend*

### 🔑 Demo Credentials
You can use the following test accounts to explore the different role-based dashboards without needing to register:
- **Admin:** `admin@gmail.com` / `asdf1234`
- **Landlord:** `jabeen@gmail.com.com` / `asdf1234`
- **Tenant:** `ritu@gmail.com` / `asdf1234`

---

## 🌟 Key Features

### 👤 For Tenants
- **Browse & Filter Properties:** Easily search for properties using advanced filters (location, category, price range, bedrooms) with pagination.
- **Rental Requests:** Send rental requests to landlords directly from the property page and track their status (Pending, Approved, Rejected).
- **Secure Payments:** Integrated with Stripe for seamless, secure checkout sessions to pay rent and security deposits for approved requests.
- **Payment & Request History:** Keep track of all paid rentals, active requests, and transaction receipts in a dedicated dashboard.
- **Reviews & Ratings:** Leave reviews for properties and landlords after a successful rental process.

### 🏢 For Landlords
- **Property Management:** Add, edit, and manage property listings with detailed descriptions, images, and amenities.
- **Smart Request Management:** Instantly view incoming rental requests from tenants. Accept or reject requests with a single click.
- **Tenant History:** Keep a track record of past and current tenants.
- **Dynamic Analytics Dashboard:** Visualize property performance, earnings, and request statistics using beautifully rendered charts.

### 👑 For Administrators
- **Global Overview:** Oversee every rental and property listed on the platform.
- **User Management:** Review all registered users (Tenants and Landlords), change their statuses (Active, Banned), and manage platform moderation.
- **Category & Location Management:** Dynamically add and manage property categories (e.g., Duplex, Apartment) and locations.

---

## 🛠️ Tech Stack

### Frontend (basha-khuji-client)
- **Next.js (App Router):** Modern, fast React framework for server-side rendering, SEO optimization, and API routes.
- **Tailwind CSS & Shadcn/ui:** Responsive, utility-first styling with beautiful, accessible pre-built UI components.
- **TanStack Query (React Query):** Powerful data fetching, caching, and state synchronization without hard page reloads.
- **React Hook Form & Zod:** Robust form validation and error handling.
- **Zustand:** Lightweight global state management.
- **Lucide React:** Modern and consistent iconography.

### Backend (basha-khuji-server)
- **Node.js & Express.js:** Robust server and RESTful API infrastructure.
- **Prisma ORM:** Next-generation Node.js and TypeScript ORM for robust database querying.
- **Stripe API:** Processing secure online payments and handling checkout webhooks asynchronously.
- **Custom Authentication Middleware:** Secure JWT-based authentication and role-based access control (RBAC).

---

## 📦 Dependencies

The frontend client relies on a robust ecosystem of modern React libraries and tools.

### Core Dependencies
- **Core Framework:** `next` (^16.2.12), `react` (19.2.4), `react-dom` (19.2.4)
- **Data Fetching & State:** `@tanstack/react-query` (^5.101.4), `axios` (^1.18.1), `zustand` (^5.0.14)
- **UI & Styling:** `tailwindcss` (^4.0), `shadcn` (^4.16.0), `tailwind-merge`, `clsx`, `tw-animate-css`
- **Icons & Feedback:** `lucide-react` (^1.27.0), `sonner` (^2.0.7)
- **Forms & Validation:** `react-hook-form` (^7.83.0), `@hookform/resolvers` (^5.5.7), `zod` (^4.4.3)
- **Data Visualization:** `recharts` (^3.10.1)
- **Utils:** `date-fns` (^4.4.0), `js-cookie` (^3.0.8)

### Development Dependencies
- **Build Tooling:** `eslint`, `typescript`
- **Typings:** `@types/react`, `@types/node`, `@types/js-cookie`

---

## 📄 API Documentation

For a comprehensive mapping of all frontend React Query hooks to their respective backend Express endpoints, please refer to the **[API Integration Document](./API_INTEGRATION.md)**.

---

## 📁 Project Structure

```text
basha-khuji-client/
├── app/                  # Next.js App Router structure (Pages, Layouts, API Routes)
│   ├── (auth)/           # Authentication routes (Login, Register)
│   ├── (public)/         # Public-facing routes (Home, Properties)
│   ├── dashboard/        # Role-based dashboards (Admin, Landlord, Tenant)
│   └── _components/      # Shared components specific to routes
├── components/           # Reusable UI components (Shadcn UI, Shared)
├── hooks/                # Custom React Hooks (React Query logic)
├── lib/                  # Utility functions (Axios instances, Formatting)
├── types/                # TypeScript interfaces and type definitions
└── API_INTEGRATION.md    # Documentation mapping frontend hooks to backend endpoints
```

---

## 🚀 Local Development Setup

Follow these steps to set up the project on your local machine.

### Prerequisites
- Node.js (v18+)
- Backend server running (for API access)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd basha-khuji-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the required environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
*(Add any other necessary frontend environment variables here)*

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📦 Architecture Highlights

- **Hybrid Rendering:** Leverages Next.js Server Components for initial fast loads and SEO, combined with Client Components for rich interactivity (using React Query).
- **Responsive Dashboard:** The dashboard layouts for all three roles (Admin, Landlord, Tenant) are built with a mobile-first approach, ensuring a seamless experience across all devices.
- **Optimistic UI Updates:** Using TanStack Query's invalidation, UI components (like request status changes or property deletions) update instantly without hard page reloads.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
