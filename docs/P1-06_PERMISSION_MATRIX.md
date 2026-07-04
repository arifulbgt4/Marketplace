# P1-06 Permission Matrix

## Status: Complete

## Role Definitions

| Role | Description | Default |
|------|-------------|---------|
| **CUSTOMER** | End user who browses and purchases | Yes |
| **ADMIN** | Full system access | No |
| **CATALOG_MANAGER** | Product and category management | No |
| **SUPPORT** | Customer support and order assistance | No |

## Permission Matrix

### Product/Catalog Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| View published products | Yes | Yes | Yes | Yes |
| View draft products | No | Yes | Yes | No |
| View archived products | No | Yes | Yes | No |
| Create product | No | Yes | Yes | No |
| Update product | No | Yes | Yes | No |
| Delete product | No | Yes | No | No |
| Archive product | No | Yes | Yes | No |
| Publish product | No | Yes | Yes | No |
| Manage variants | No | Yes | Yes | No |
| Manage categories | No | Yes | Yes | No |
| View inventory | No | Yes | Yes | Yes |
| Adjust inventory | No | Yes | Yes | No |

### Order Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| View own orders | Yes | Yes | No | Yes |
| View all orders | No | Yes | No | Yes |
| Create order | Yes | Yes | No | No |
| Cancel own order | Yes | Yes | No | No |
| Cancel any order | No | Yes | No | Yes |
| Update order status | No | Yes | No | Yes |
| View order details | Own only | Yes | No | Yes |
| Process refund | No | Yes | No | No |
| Record COD collection | No | Yes | No | Yes |

### Payment Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| Initiate payment | Yes | Yes | No | No |
| View own payments | Yes | Yes | No | Yes |
| View all payments | No | Yes | No | Yes |
| Process refund | No | Yes | No | No |
| Manage payment settings | No | Yes | No | No |
| View payment reports | No | Yes | No | No |

### User Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| Register | Yes | Yes | Yes | Yes |
| Login | Yes | Yes | Yes | Yes |
| View own profile | Yes | Yes | Yes | Yes |
| Update own profile | Yes | Yes | Yes | Yes |
| View any profile | No | Yes | No | Yes |
| Disable user | No | Yes | No | No |
| Change user role | No | Yes | No | No |
| View user list | No | Yes | No | Yes |

### Review Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| View reviews | Yes | Yes | Yes | Yes |
| Create review | Yes (purchased only) | Yes | No | No |
| Delete own review | Yes | Yes | No | No |
| Delete any review | No | Yes | No | No |
| Approve review | No | Yes | No | No |
| Hide review | No | Yes | No | Yes |
| Flag review | No | Yes | No | Yes |

### Settings Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| View business settings | Public only | Yes | No | No |
| Update business settings | No | Yes | No | No |
| View branding settings | Public only | Yes | No | No |
| Update branding settings | No | Yes | No | No |
| Manage payment methods | No | Yes | No | No |
| Manage delivery zones | No | Yes | No | No |
| Manage COD rules | No | Yes | No | No |
| Manage coupons | No | Yes | Yes | No |

### Content Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| View homepage | Yes | Yes | Yes | Yes |
| View published content | Yes | Yes | Yes | Yes |
| Edit homepage sections | No | Yes | No | No |
| Manage content blocks | No | Yes | No | No |
| Preview draft content | No | Yes | No | No |

### Messaging Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| Send message | Yes | Yes | Yes | Yes |
| Read own messages | Yes | Yes | Yes | Yes |
| Read any messages | No | Yes | No | Yes |
| Delete message | Own only | Yes | No | No |
| Search messages | Own only | Yes | No | Yes |

### Reporting Operations

| Operation | CUSTOMER | ADMIN | CATALOG_MANAGER | SUPPORT |
|-----------|----------|-------|-----------------|---------|
| View own stats | Yes | Yes | No | No |
| View business dashboard | No | Yes | No | No |
| View revenue reports | No | Yes | No | No |
| View inventory reports | No | Yes | Yes | No |
| Export data | No | Yes | No | No |
| View audit log | No | Yes | No | No |

## Authorization Rules

### Rule 1: Deny by Default
All operations are denied unless explicitly allowed by role.

### Rule 2: Self-Only Access
Customers can only access their own:
- Profile
- Orders
- Reviews
- Messages
- Bookmarks
- Addresses

### Rule 3: Ownership Verification
Before any mutation, verify:
1. User is authenticated
2. User has required role
3. User owns the resource (for customer operations)

### Rule 4: Admin Bypass
Admin role bypasses all ownership checks but is still logged for audit.

### Rule 5: Mutation Logging
All mutations by ADMIN, CATALOG_MANAGER, and SUPPORT roles are logged to audit trail.

## Current Gaps

| Gap | Risk | Mitigation |
|-----|------|------------|
| No role in session | Cannot enforce RBAC | Add role to JWT |
| No ownership checks | Users can modify others' data | Add ownership verification |
| No audit logging | Cannot track changes | Implement audit trail |
| No admin UI protection | Admin functions exposed | Add admin layout protection |
| No mutation authorization | Server actions callable without auth | Add auth checks to all mutations |

## Implementation Priority

1. **Phase 2**: Add role to session, implement basic ownership checks
2. **Phase 2**: Add auth checks to all server actions
3. **Phase 3**: Implement admin layout protection
4. **Phase 7**: Full audit logging
5. **Phase 7**: Advanced RBAC policies
