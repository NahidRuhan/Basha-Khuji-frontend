export enum UserRole {
  TENANT = "TENANT",
  LANDLORD = "LANDLORD",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

export enum RentalRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum PaymentProvider {
  STRIPE = "STRIPE",
  SSLCOMMERZ = "SSLCOMMERZ",
}

export interface User {
  userId: string;
  userName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string | null;
  phoneNumber?: string | null;
  occupation?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  categoryId: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  locationId: string;
  locationName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  propertyId: string;
  userId: string;
  categoryId: string;
  locationId: string;
  propertyName: string;
  price: number;
  address: string;
  description: string;
  isAvailable: boolean;
  isArchived?: boolean;
  amenities: string[];
  vacantFrom: string;
  images: string[];
  bedroomCount: number;
  squarefoot: number;
  createdAt: string;
  updatedAt: string;
  
  category?: Category;
  location?: Location;
  user?: Partial<User>;
}

export interface RentalRequest {
  requestId: string;
  userId: string;
  propertyId: string;
  message: string;
  status: RentalRequestStatus;
  createdAt: string;
  updatedAt: string;
  
  property?: Property;
  user?: Partial<User>;
  review?: Review;
}

export interface Payment {
  paymentId: string;
  requestId: string;
  transactionId: string;
  amount: number | string;
  status: PaymentStatus;
  paidAt?: string;
  provider: PaymentProvider;
  
  rentalRequest?: RentalRequest;
}

export interface Review {
  reviewId: string;
  requestId: string;
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: Meta;
}
