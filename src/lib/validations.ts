import { z } from "zod";

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
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const userSigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  callbackUrl: z.string().optional(),
});

export const listingSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be at most 5000 characters"),
  price: z.number().positive("Price must be positive").max(100000, "Price is too high"),
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

export const orderSchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
  startDate: z.date().min(new Date(), "Start date must be in the future"),
  endDate: z.date(),
  guests: z.number().int().min(1).max(100).default(1),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const reviewSchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  checkIn: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  comment: z.string().max(1000, "Comment must be at most 1000 characters").optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  icon: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserSigninInput = z.infer<typeof userSigninSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
