-- CreateTable
CREATE TABLE "ProgrammeResource" (
    "id" TEXT NOT NULL,
    "programme" TEXT NOT NULL,
    "driveUrl" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgrammeResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgrammeResource_programme_key" ON "ProgrammeResource"("programme");
