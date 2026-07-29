import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function serverFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth, headers, ...restOptions } = options;
  
  const headersList = new Headers(headers);
  headersList.set("Content-Type", "application/json");

  // In Next.js 15, cookies() returns a promise. Awaiting it works for both 14 and 15 (if typed to Promise).
  // But standard usage in 14 is just `const cookieStore = cookies()`.
  // Next.js 15+ requires awaiting cookies()
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    headersList.set("Authorization", `Bearer ${token}`);
  } else if (requireAuth) {
    throw new Error("Unauthorized: No access token found");
  }

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: headersList,
    ...restOptions,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
