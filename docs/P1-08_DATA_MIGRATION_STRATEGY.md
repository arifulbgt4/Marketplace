# P1-08 Data Migration Strategy

## Status: Complete

## Current Schema Summary

### Existing Models
- User
- Account
- UserMedia
- Category
- Listing (property/rental-specific)
- Order (single listing booking)
- Review
- Message
- Bookmark

### Missing Models (Required for B2C Marketplace)
- Product
- ProductVariant
- ProductOption
- ProductMedia
- Inventory
- Cart
- CartItem
- Payment
- PaymentEvent
- Shipment
- Coupon
- CouponUsage
- BusinessSettings
- BrandingSettings
- DeliveryZone
- DeliveryMethod
- AuditLog
- Notification

## Migration Strategy

### Phase 1: Schema Extension (Non-Breaking)

**Goal**: Add new models without breaking existing functionality.

**Approach**: Create new tables alongside existing ones.

| New Table | Purpose | Relationships |
|-----------|---------|---------------|
| Product | Generic sellable item | Links to Category |
| ProductVariant | SKU-level pricing | Links to Product |
| ProductOption | Variant attributes | Links to Product |
| ProductMedia | Product images | Links to Product |
| Inventory | Stock tracking | Links to ProductVariant |
| Cart | Shopping cart | Links to User (optional) |
| CartItem | Cart contents | Links to Cart + ProductVariant |
| Payment | Payment attempts | Links to Order |
| PaymentEvent | Payment history | Links to Payment |
| Shipment | Delivery tracking | Links to Order |
| Coupon | Discount codes | Standalone |
| CouponUsage | Coupon redemptions | Links to Coupon + Order |
| BusinessSettings | Config storage | Standalone |
| BrandingSettings | Visual config | Standalone |
| DeliveryZone | Shipping zones | Standalone |
| DeliveryMethod | Shipping methods | Links to DeliveryZone |
| AuditLog | Change tracking | Standalone |
| Notification | User notifications | Links to User |

### Phase 2: Data Backfill

**Goal**: Migrate existing Listing data to Product model.

#### Listing → Product Mapping

| Listing Field | Product Field | Transformation |
|---------------|---------------|----------------|
| id | id | Keep as-is |
| title | name | Direct copy |
| slug | slug | Direct copy |
| description | description | Direct copy |
| price | price | Convert Float to Decimal |
| discount | Compare at price | Calculate original price |
| status | status | Map: published→active, draft→draft |
| type | attributes | Store as JSON attribute |
| images | ProductMedia | Create media records |
| address | Store in ProductVariant | Add as location attribute |
| bedrooms | attributes | Store as JSON attribute |
| bathrooms | attributes | Store as JSON attribute |
| area | attributes | Store as JSON attribute |
| amenities | attributes | Store as JSON attribute |
| maxGuests | attributes | Store as JSON attribute |
| categoryId | categoryId | Direct copy |
| userId | createdAtBy | Track who created |
| createdAt | createdAt | Direct copy |
| updatedAt | updatedAt | Direct copy |

#### Order → Order Migration

| Old Order Field | New Order Field | Transformation |
|-----------------|-----------------|----------------|
| id | id | Keep as-is |
| orderNo | orderNo | Direct copy |
| status | status | Map to new enum |
| startDate | metadata | Store as JSON |
| endDate | metadata | Store as JSON |
| totalPrice | total | Convert Float to Decimal |
| guests | metadata | Store as JSON |
| userId | userId | Direct copy |
| listingId | OrderItem | Create order item |

#### Review Migration

| Old Review Field | New Review Field | Transformation |
|------------------|------------------|----------------|
| id | id | Keep as-is |
| rating | rating | Direct copy |
| cleanliness | metadata | Store as JSON |
| communication | metadata | Store as JSON |
| checkIn | metadata | Store as JSON |
| accuracy | metadata | Store as JSON |
| location | metadata | Store as JSON |
| value | metadata | Store as JSON |
| comment | comment | Direct copy |
| userId | authorId | Direct copy |
| listingId | productId | Direct copy |

### Phase 3: Code Migration

**Goal**: Update application code to use new models.

#### Steps:
1. Add Prisma client extensions for new models
2. Update server actions to use Product model
3. Update API routes to use Product model
4. Update UI components to display Product data
5. Keep Listing model for backward compatibility
6. Add feature flags for new vs old code paths

### Phase 4: Cleanup

**Goal**: Remove legacy models after validation.

#### Steps:
1. Verify all data migrated correctly
2. Update all references to use new models
3. Mark Listing model as deprecated
4. Create migration to drop Listing table
5. Update documentation

## Rollback Strategy

### Backup Requirements
- Full database backup before migration
- Export all Listing data as JSON
- Export all Order data as JSON
- Export all Review data as JSON

### Rollback Steps
1. Restore database from backup
2. Revert code to previous version
3. Verify application works
4. Notify stakeholders

## Coexistence Rules

### During Migration
1. **Read from new tables**: New code reads from Product
2. **Write to both tables**: Writes go to both Listing and Product
3. **Sync job**: Background job keeps data in sync
4. **Feature flag**: Toggle between old and new code paths

### After Migration
1. **Read from new tables only**: All reads from Product
2. **Write to new tables only**: All writes to Product
3. **Listing table**: Archived, not deleted
4. **Fallback**: Can revert if issues found

## Data Validation

### Pre-Migration Checks
1. Count all Listing records
2. Count all Order records
3. Count all Review records
4. Verify no orphaned records
5. Export sample data for comparison

### Post-Migration Checks
1. Verify record counts match
2. Verify data integrity
3. Run application tests
4. Verify UI displays correctly
5. Verify API responses correct

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Schema Extension | 2 days | None |
| Phase 2: Data Backfill | 3 days | Phase 1 |
| Phase 3: Code Migration | 5 days | Phase 2 |
| Phase 4: Cleanup | 2 days | Phase 3 |
| **Total** | **12 days** | |

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss | High | Full backup before migration |
| Downtime | Medium | Blue-green deployment |
| Performance | Medium | Index new tables |
| Compatibility | High | Feature flags + rollback |
| Data integrity | High | Validation scripts |
