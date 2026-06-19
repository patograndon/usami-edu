-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SOSTENEDOR';

-- CreateTable
CREATE TABLE "SostenedorTenant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "SostenedorTenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SostenedorTenant_userId_tenantId_key" ON "SostenedorTenant"("userId", "tenantId");

-- AddForeignKey
ALTER TABLE "SostenedorTenant" ADD CONSTRAINT "SostenedorTenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SostenedorTenant" ADD CONSTRAINT "SostenedorTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
