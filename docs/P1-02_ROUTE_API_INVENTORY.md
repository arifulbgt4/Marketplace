# P1-02 Route/API Inventory

## Status: Complete

## Page Routes

### Public Pages (No Auth Required)

| Route | Layout | Description | Data Source |
|-------|--------|-------------|-------------|
| `/` | WrappedPages | Home with SearchBanner and FeaturedListings | `getFeaturedListings()` |
| `/l` | WrappedPages | Listings index with search/filter | `getSearchListings()` |
| `/l/[slug]` | WrappedPages | Listing detail page | `getListingBySlug()` |
| `/merchant/[userID]` | WrappedPages | Merchant profile page | User + listings query |
| `/signin` | AuthPages | Sign in form | NextAuth |
| `/signup` | AuthPages | Sign up form | `/api/register` |
| `/faq` | WrappedPages | FAQ page | Static content |
| `/about` | WrappedPages | About page | Static content |
| `/blog` | WrappedPages | Blog page | Static content |
| `/contact` | WrappedPages | Contact page | ContactForm |
| `/terms` | WrappedPages | Terms page | Static content |
| `/privacy` | WrappedPages | Privacy page | Static content |
| `/cookies` | WrappedPages | Cookies page | Static content |
| `/lab` | Lab | Laboratory/Storybook | Storybook |

### Protected Pages (Auth Required)

| Route | Layout | Description | Auth Check |
|-------|--------|-------------|------------|
| `/l/create` | UnwrappedPages | Create new listing | Session required |
| `/l/edit/[slug]` | WrappedPages | Edit listing | Session + ownership |
| `/u/dashboard` | WrappedPages | User dashboard | Session required |
| `/u/account` | WrappedPages | Account settings | Session required |
| `/u/listing` | WrappedPages | User's listings | Session required |
| `/u/bookmark` | WrappedPages | User's bookmarks | Session required |
| `/u/order` | WrappedPages | User's orders | Session required |
| `/u/setting` | WrappedPages | General settings | Session required |
| `/u/setting/media` | WrappedPages | Media settings | Session required |
| `/u/setting/security` | WrappedPages | Security settings | Session required |
| `/u/setting/social` | WrappedPages | Social settings | Session required |
| `/message` | UnwrappedPages | Messaging | Session required |

## API Routes

| Route | Methods | Auth | Rate Limit | Description |
|-------|---------|------|------------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | No | No | NextAuth.js handler |
| `/api/register` | POST | No | 5 req/15min | User registration |
| `/api/session` | GET | Yes | No | Current session info |
| `/api/listings` | GET, POST | GET: No, POST: Yes | No | Listings CRUD |
| `/api/orders` | GET, POST | Yes | No | Orders CRUD |
| `/api/reviews` | GET, POST | GET: No, POST: Yes | No | Reviews CRUD |

## Server Actions

| File | Function | Auth | Authorization | Description |
|------|----------|------|---------------|-------------|
| `user.ts` | `getUser()` | Yes | Self only | Get current user |
| `user.ts` | `updateUser()` | No | None | Update user profile |
| `user.ts` | `getUserListings()` | Yes | Self only | Get user's listings |
| `listing.ts` | `getFeaturedListings()` | No | None | Get 12 latest published |
| `listing.ts` | `getListingBySlug()` | No | None | Get single listing |
| `listing.ts` | `getSearchListings()` | No | None | Search with filters |
| `listing.ts` | `getListingCategories()` | No | None | Get all categories |
| `listing.ts` | `createListing()` | No | None | Create new listing |
| `listing.ts` | `updateListing()` | No | None | Update listing |
| `listing.ts` | `deleteListing()` | No | None | Delete listing |
| `order.ts` | `createOrder()` | Yes | Self only | Create new order |
| `order.ts` | `getUserOrders()` | Yes | Self only | Get user's orders |
| `order.ts` | `updateOrderStatus()` | No | None | Update order status |
| `review.ts` | `getListingReviews()` | No | None | Get reviews for listing |
| `review.ts` | `getListingRatingSummary()` | No | None | Get rating summary |
| `review.ts` | `createReview()` | Yes | Self only | Create review |
| `bookmark.ts` | `toggleBookmark()` | Yes | Self only | Toggle bookmark |
| `bookmark.ts` | `getUserBookmarks()` | Yes | Self only | Get user's bookmarks |
| `bookmark.ts` | `isBookmarked()` | Yes | Self only | Check if bookmarked |

## Middleware Route Protection

| Pattern | Behavior |
|---------|----------|
| `/` | Public - i18n only |
| `/signin`, `/signup` | Public - redirect if authenticated |
| `/l/*` | Public - i18n only |
| `/merchant/*` | Public - i18n only |
| `/api/auth/*` | Public - NextAuth handler |
| `/api/register` | Public - rate limited |
| `/*` (all other) | Protected - JWT validation |

## Data Sources

| Source | Location | Description |
|--------|----------|-------------|
| PostgreSQL | Prisma Client | Primary data store |
| NextAuth | JWT session | Authentication state |
| next-intl | `messages/*.json` | Localization strings |
| MUI Theme | `src/theme/` | Design tokens |
| Static Data | `src/global/staticData/` | Amenities, property types, etc. |

## Gaps Identified

1. **Missing Authorization**: `updateUser`, `createListing`, `updateListing`, `deleteListing`, `updateOrderStatus` lack auth checks
2. **Missing Role Checks**: No admin role verification on any endpoint
3. **In-Memory Rate Limiter**: Registration rate limiter won't work in serverless/edge
4. **No CSRF Protection**: API routes lack CSRF token validation
5. **No Input Sanitization**: Some fields missing XSS protection
