-- Multi-tenancy: tenants table, nullable tenantId on scoped models, FKs, indexes,
-- plus a default tenant and backfill so existing rows are assigned (prod-safe).

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "tenantId" TEXT;
ALTER TABLE "clients" ADD COLUMN     "tenantId" TEXT;
ALTER TABLE "appointments" ADD COLUMN     "tenantId" TEXT;
ALTER TABLE "medical_records" ADD COLUMN     "tenantId" TEXT;
ALTER TABLE "prescriptions" ADD COLUMN     "tenantId" TEXT;
ALTER TABLE "invoices" ADD COLUMN     "tenantId" TEXT;
ALTER TABLE "users" ADD COLUMN     "tenantId" TEXT;

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");
CREATE INDEX "patients_tenantId_idx" ON "patients"("tenantId");
CREATE INDEX "clients_tenantId_idx" ON "clients"("tenantId");
CREATE INDEX "appointments_tenantId_idx" ON "appointments"("tenantId");
CREATE INDEX "medical_records_tenantId_idx" ON "medical_records"("tenantId");
CREATE INDEX "prescriptions_tenantId_idx" ON "prescriptions"("tenantId");
CREATE INDEX "invoices_tenantId_idx" ON "invoices"("tenantId");
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "clients" ADD CONSTRAINT "clients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Default tenant + backfill existing rows (expand/backfill; tenantId stays
-- nullable and is enforced at the application layer by the tenant extension).
INSERT INTO "tenants" ("id", "name", "slug", "status", "createdAt", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Clinic', 'default', 'active', NOW(), NOW());

UPDATE "patients"        SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
UPDATE "clients"         SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
UPDATE "appointments"    SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
UPDATE "medical_records" SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
UPDATE "prescriptions"   SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
UPDATE "invoices"        SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
UPDATE "users"           SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
