CREATE TYPE "SupportRequestStatus" AS ENUM (
  'OPEN',
  'IN_PROGRESS',
  'WAITING_FOR_CUSTOMER',
  'RESOLVED',
  'CLOSED'
);

CREATE TYPE "SupportRequestPriority" AS ENUM (
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT'
);

CREATE TYPE "SupportRequestSource" AS ENUM (
  'CONTACT',
  'LISTING_REPORT'
);

CREATE TABLE "SupportRequest" (
  "id" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "ownerId" TEXT,
  "assignedToId" TEXT,
  "source" "SupportRequestSource" NOT NULL,
  "status" "SupportRequestStatus" NOT NULL DEFAULT 'OPEN',
  "priority" "SupportRequestPriority" NOT NULL DEFAULT 'NORMAL',
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "context" JSONB NOT NULL DEFAULT '{}',
  "internalNote" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SupportRequest_version_check" CHECK ("version" > 0)
);

CREATE UNIQUE INDEX "SupportRequest_reference_key"
  ON "SupportRequest"("reference");
CREATE INDEX "SupportRequest_status_priority_createdAt_idx"
  ON "SupportRequest"("status", "priority", "createdAt");
CREATE INDEX "SupportRequest_source_createdAt_idx"
  ON "SupportRequest"("source", "createdAt");
CREATE INDEX "SupportRequest_ownerId_createdAt_idx"
  ON "SupportRequest"("ownerId", "createdAt");
CREATE INDEX "SupportRequest_assignedToId_status_idx"
  ON "SupportRequest"("assignedToId", "status");

ALTER TABLE "SupportRequest"
  ADD CONSTRAINT "SupportRequest_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportRequest"
  ADD CONSTRAINT "SupportRequest_assignedToId_fkey"
  FOREIGN KEY ("assignedToId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
