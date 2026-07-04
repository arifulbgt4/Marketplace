import { describe, it, expect } from "vitest";
import {
  userRegisterSchema,
  userSigninSchema,
  listingSchema,
  orderSchema,
  reviewSchema,
  searchSchema,
} from "src/lib/validations";

describe("Validation Schemas", () => {
  describe("userRegisterSchema", () => {
    it("should validate a valid user registration", () => {
      const validUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
      };

      const result = userRegisterSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidUser = {
        name: "John Doe",
        email: "invalid-email",
        password: "Password123",
      };

      const result = userRegisterSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const invalidUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "Pass1",
      };

      const result = userRegisterSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject password without uppercase", () => {
      const invalidUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const result = userRegisterSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject short name", () => {
      const invalidUser = {
        name: "J",
        email: "john@example.com",
        password: "Password123",
      };

      const result = userRegisterSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe("userSigninSchema", () => {
    it("should validate a valid sign in", () => {
      const validSignin = {
        email: "john@example.com",
        password: "password123",
      };

      const result = userSigninSchema.safeParse(validSignin);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidSignin = {
        email: "invalid-email",
        password: "password123",
      };

      const result = userSigninSchema.safeParse(invalidSignin);
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const invalidSignin = {
        email: "john@example.com",
        password: "",
      };

      const result = userSigninSchema.safeParse(invalidSignin);
      expect(result.success).toBe(false);
    });
  });

  describe("listingSchema", () => {
    it("should validate a valid listing", () => {
      const validListing = {
        title: "Beautiful Apartment",
        description: "A beautiful apartment in the city center",
        price: 150,
        images: ["https://example.com/image.jpg"],
        address: "123 Main St, City",
      };

      const result = listingSchema.safeParse(validListing);
      expect(result.success).toBe(true);
    });

    it("should reject short title", () => {
      const invalidListing = {
        title: "Hi",
        description: "A beautiful apartment in the city center",
        price: 150,
        images: ["https://example.com/image.jpg"],
        address: "123 Main St, City",
      };

      const result = listingSchema.safeParse(invalidListing);
      expect(result.success).toBe(false);
    });

    it("should reject negative price", () => {
      const invalidListing = {
        title: "Beautiful Apartment",
        description: "A beautiful apartment in the city center",
        price: -100,
        images: ["https://example.com/image.jpg"],
        address: "123 Main St, City",
      };

      const result = listingSchema.safeParse(invalidListing);
      expect(result.success).toBe(false);
    });

    it("should reject empty images array", () => {
      const invalidListing = {
        title: "Beautiful Apartment",
        description: "A beautiful apartment in the city center",
        price: 150,
        images: [],
        address: "123 Main St, City",
      };

      const result = listingSchema.safeParse(invalidListing);
      expect(result.success).toBe(false);
    });
  });

  describe("orderSchema", () => {
    it("should validate a valid order", () => {
      const futureStart = new Date();
      futureStart.setDate(futureStart.getDate() + 7);
      const futureEnd = new Date();
      futureEnd.setDate(futureEnd.getDate() + 14);

      const validOrder = {
        listingId: "550e8400-e29b-41d4-a716-446655440000",
        startDate: futureStart,
        endDate: futureEnd,
        guests: 2,
      };

      const result = orderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it("should reject end date before start date", () => {
      const invalidOrder = {
        listingId: "550e8400-e29b-41d4-a716-446655440000",
        startDate: new Date("2024-12-05"),
        endDate: new Date("2024-12-01"),
        guests: 2,
      };

      const result = orderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });
  });

  describe("reviewSchema", () => {
    it("should validate a valid review", () => {
      const validReview = {
        listingId: "550e8400-e29b-41d4-a716-446655440000",
        rating: 4.5,
        comment: "Great place!",
      };

      const result = reviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
    });

    it("should reject rating below 1", () => {
      const invalidReview = {
        listingId: "550e8400-e29b-41d4-a716-446655440000",
        rating: 0.5,
      };

      const result = reviewSchema.safeParse(invalidReview);
      expect(result.success).toBe(false);
    });

    it("should reject rating above 5", () => {
      const invalidReview = {
        listingId: "550e8400-e29b-41d4-a716-446655440000",
        rating: 5.5,
      };

      const result = reviewSchema.safeParse(invalidReview);
      expect(result.success).toBe(false);
    });
  });

  describe("searchSchema", () => {
    it("should validate a valid search", () => {
      const validSearch = {
        query: "apartment",
        page: 1,
        limit: 12,
      };

      const result = searchSchema.safeParse(validSearch);
      expect(result.success).toBe(true);
    });

    it("should use default values", () => {
      const minimalSearch = {};

      const result = searchSchema.safeParse(minimalSearch);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(12);
      }
    });

    it("should reject limit above 50", () => {
      const invalidSearch = {
        limit: 100,
      };

      const result = searchSchema.safeParse(invalidSearch);
      expect(result.success).toBe(false);
    });
  });
});
