-- CreateEnum
CREATE TYPE "ContentSectionStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN', 'FLAGGED');

-- AlterTable
ALTER TABLE "Review"
ALTER COLUMN "listingId" DROP NOT NULL,
ADD COLUMN "productId" TEXT,
ADD COLUMN "orderItemId" TEXT,
ADD COLUMN "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "status" "ReviewStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN "moderatedById" TEXT,
ADD COLUMN "moderationNote" TEXT,
ADD COLUMN "moderatedAt" TIMESTAMP(3),
ADD COLUMN "publishedAt" TIMESTAMP(3);

-- Existing listing reviews remain valid because listingId is populated,
-- productId is null, and the legacy-safe status default is APPROVED.
ALTER TABLE "Review"
ADD CONSTRAINT "Review_exactly_one_target_check"
CHECK (num_nonnulls("listingId", "productId") = 1),
ADD CONSTRAINT "Review_order_item_product_target_check"
CHECK ("orderItemId" IS NULL OR "productId" IS NOT NULL),
ADD CONSTRAINT "Review_verified_purchase_check"
CHECK (
    "verifiedPurchase" = false
    OR ("productId" IS NOT NULL AND "orderItemId" IS NOT NULL)
);

-- CreateTable
CREATE TABLE "ContentSection" (
    "id" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "sectionType" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "status" "ContentSectionStatus" NOT NULL DEFAULT 'draft',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "content" JSONB NOT NULL DEFAULT '{}',
    "revision" INTEGER NOT NULL DEFAULT 1,
    "editorId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentSection_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ContentSection_revision_check" CHECK ("revision" > 0),
    CONSTRAINT "ContentSection_identity_check" CHECK (
        length(trim("sectionKey")) > 0
        AND length(trim("sectionType")) > 0
        AND length(trim("locale")) > 0
    )
);

-- CreateTable
CREATE TABLE "ProductWishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductWishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceEventId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "readAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailTransactional" BOOLEAN NOT NULL DEFAULT true,
    "emailMarketing" BOOLEAN NOT NULL DEFAULT false,
    "inAppTransactional" BOOLEAN NOT NULL DEFAULT true,
    "inAppMarketing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderItemId_key" ON "Review"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");

-- CreateIndex
CREATE INDEX "Review_productId_status_idx" ON "Review"("productId", "status");

-- CreateIndex
CREATE INDEX "Review_userId_status_idx" ON "Review"("userId", "status");

-- CreateIndex
CREATE INDEX "Review_moderatedById_idx" ON "Review"("moderatedById");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSection_sectionKey_locale_revision_key" ON "ContentSection"("sectionKey", "locale", "revision");

-- Only one revision for a localized section can be live at a time.
CREATE UNIQUE INDEX "ContentSection_one_published_revision_key"
ON "ContentSection"("sectionKey", "locale")
WHERE "status" = 'published';

-- CreateIndex
CREATE INDEX "ContentSection_status_isVisible_displayOrder_idx" ON "ContentSection"("status", "isVisible", "displayOrder");

-- CreateIndex
CREATE INDEX "ContentSection_sectionType_idx" ON "ContentSection"("sectionType");

-- CreateIndex
CREATE INDEX "ContentSection_editorId_idx" ON "ContentSection"("editorId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductWishlistItem_userId_productId_key" ON "ProductWishlistItem"("userId", "productId");

-- CreateIndex
CREATE INDEX "ProductWishlistItem_productId_idx" ON "ProductWishlistItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_sourceEventId_key" ON "Notification"("sourceEventId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSection" ADD CONSTRAINT "ContentSection_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductWishlistItem" ADD CONSTRAINT "ProductWishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductWishlistItem" ADD CONSTRAINT "ProductWishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
