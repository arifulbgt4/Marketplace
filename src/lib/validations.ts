import { z } from "zod";
import { validateEnv, type EnvVarSchema } from "src/lib/env";

// Environment validation
export { validateEnv, type EnvVarSchema } from "src/lib/env";

// User validation schemas
export const userRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const userSigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  callbackUrl: z.string().optional(),
});

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/)
    .nullable()
    .optional(),
  image: z.string().url().nullable().optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

// Listing validation schemas
export const listingSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be at most 5000 characters"),
  price: z
    .number()
    .positive("Price must be positive")
    .max(100000, "Price is too high"),
  discount: z.number().positive().max(100000).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  type: z.enum(["rent", "sale"]).default("rent"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  address: z.string().min(5, "Address is required"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  bedrooms: z.number().int().min(0).max(50).optional(),
  bathrooms: z.number().int().min(0).max(50).optional(),
  area: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  maxGuests: z.number().int().min(1).max(100).optional(),
  categoryId: z.string().uuid().optional(),
});

export const listingUpdateSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters")
    .optional(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be at most 5000 characters")
    .optional(),
  price: z
    .number()
    .positive("Price must be positive")
    .max(100000, "Price is too high")
    .optional(),
  discount: z.number().positive().max(100000).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  type: z.enum(["rent", "sale"]).optional(),
  images: z.array(z.string().url()).optional(),
  address: z.string().min(5, "Address is required").optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  bedrooms: z.number().int().min(0).max(50).optional(),
  bathrooms: z.number().int().min(0).max(50).optional(),
  area: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  maxGuests: z.number().int().min(1).max(100).optional(),
  categoryId: z.string().uuid().optional(),
});

// Order validation schemas
export const orderSchema = z
  .object({
    listingId: z.string().uuid("Invalid listing ID"),
    startDate: z.date().min(new Date(), "Start date must be in the future"),
    endDate: z.date(),
    guests: z.number().int().min(1).max(100).default(1),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const orderUpdateSchema = z
  .object({
    status: z
      .enum(["pending", "confirmed", "cancelled", "completed"])
      .optional(),
    startDate: z
      .date()
      .min(new Date(), "Start date must be in the future")
      .optional(),
    endDate: z.date().optional(),
    guests: z.number().int().min(1).max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate && data.endDate <= data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

// Review validation schemas
export const reviewSchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  checkIn: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  comment: z
    .string()
    .max(1000, "Comment must be at most 1000 characters")
    .optional(),
});

export const reviewUpdateSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  checkIn: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  icon: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  icon: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
});

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export const searchUpdateSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

// Type exports
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserSigninInput = z.infer<typeof userSigninSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type ListingUpdateInput = z.infer<typeof listingUpdateSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type SearchUpdateInput = z.infer<typeof searchUpdateSchema>;

// Currency validation schema for Phase 2-05
export const currencySchema = z.object({
  code: z.string().length(3, "Currency code must be 3 characters (ISO 4217)"),
  symbol: z.string().min(1, "Currency symbol must be set"),
  decimalPlaces: z
    .number()
    .int()
    .min(0)
    .max(6, "Decimal places must be between 0 and 6"),
  name: z.string().min(1, "Currency name must be set"),
  exchangeRate: z.number().positive("Exchange rate must be positive"),
});

// Role and Status validation (Phase 2-06)
export const roleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  permissions: z.array(z.string()),
  isSystem: z.boolean().default(false),
});

export const statusSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  type: z.enum(["order", "payment", "fulfillment"]),
  description: z.string().max(200).optional(),
});

export const userProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["user", "admin", "support", "catalog_manager"]),
  status: z.enum(["active", "suspended", "pending_verification"]),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  preferences: z
    .object({
      language: z.string().min(2).max(5),
      timezone: z.string().min(3).max(50),
      currency: z.string().length(3),
      notifications: z.object({
        email: z.boolean(),
        push: z.boolean(),
        marketing: z.boolean(),
      }),
    })
    .optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type CurrencyInput = z.infer<typeof currencySchema>;
export type RoleInput = z.infer<typeof roleSchema>;
export type StatusInput = z.infer<typeof statusSchema>;
