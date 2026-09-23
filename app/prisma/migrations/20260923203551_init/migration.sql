-- CreateTable
CREATE TABLE "Principal" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "roles" TEXT[],
    "color" TEXT NOT NULL DEFAULT '#475569',

    CONSTRAINT "Principal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "parentCode" TEXT,
    "reconcile" BOOLEAN NOT NULL DEFAULT false,
    "xmlId" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Journal" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "number" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "partner" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "state" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "journalCode" TEXT NOT NULL,
    "untaxedMinor" INTEGER NOT NULL,
    "taxMinor" INTEGER NOT NULL,
    "totalMinor" INTEGER NOT NULL,
    "configCommit" TEXT NOT NULL,
    "entryNumber" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "lineNo" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "priceUnitMinor" INTEGER NOT NULL,
    "taxCodes" TEXT[],
    "subtotalMinor" INTEGER NOT NULL,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceTax" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "lineNo" INTEGER NOT NULL,
    "taxCode" TEXT NOT NULL,
    "taxName" TEXT NOT NULL,
    "baseMinor" INTEGER NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "accountCode" TEXT,

    CONSTRAINT "InvoiceTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "number" TEXT NOT NULL,
    "journalCode" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" TEXT,
    "state" TEXT NOT NULL DEFAULT 'posted',

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "JournalLine" (
    "id" SERIAL NOT NULL,
    "entryNumber" TEXT NOT NULL,
    "lineNo" INTEGER NOT NULL,
    "accountCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "debitMinor" INTEGER NOT NULL DEFAULT 0,
    "creditMinor" INTEGER NOT NULL DEFAULT 0,
    "partner" TEXT,
    "taxCode" TEXT,
    "invoiceNumber" TEXT,

    CONSTRAINT "JournalLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigCommit" (
    "hash" TEXT NOT NULL,
    "parents" TEXT[],
    "tree" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "committedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfigCommit_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "Ref" (
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "commitHash" TEXT NOT NULL,
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Ref_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "RefLog" (
    "id" SERIAL NOT NULL,
    "refName" TEXT NOT NULL,
    "fromHash" TEXT,
    "toHash" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeRequest" (
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "sourceRef" TEXT NOT NULL,
    "targetRef" TEXT NOT NULL DEFAULT 'main',
    "headHash" TEXT NOT NULL,
    "baseHash" TEXT NOT NULL,
    "mergeBaseHash" TEXT NOT NULL,
    "effectiveFrom" DATE,
    "status" TEXT NOT NULL DEFAULT 'open',
    "openedBy" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mergedBy" TEXT,
    "mergedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "ChangeRequest_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "Check" (
    "id" SERIAL NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "headHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conclusion" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detail" JSONB NOT NULL,
    "ranAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "headHash" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "ruleId" TEXT,
    "note" TEXT,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "prevHash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvoiceLine_invoiceNumber_idx" ON "InvoiceLine"("invoiceNumber");

-- CreateIndex
CREATE INDEX "InvoiceTax_invoiceNumber_idx" ON "InvoiceTax"("invoiceNumber");

-- CreateIndex
CREATE INDEX "InvoiceTax_taxCode_idx" ON "InvoiceTax"("taxCode");

-- CreateIndex
CREATE INDEX "JournalLine_accountCode_idx" ON "JournalLine"("accountCode");

-- CreateIndex
CREATE INDEX "JournalLine_entryNumber_idx" ON "JournalLine"("entryNumber");

-- CreateIndex
CREATE INDEX "Check_requestNumber_headHash_idx" ON "Check"("requestNumber", "headHash");

-- CreateIndex
CREATE INDEX "Review_requestNumber_idx" ON "Review"("requestNumber");

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceNumber_fkey" FOREIGN KEY ("invoiceNumber") REFERENCES "Invoice"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceTax" ADD CONSTRAINT "InvoiceTax_invoiceNumber_fkey" FOREIGN KEY ("invoiceNumber") REFERENCES "Invoice"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_entryNumber_fkey" FOREIGN KEY ("entryNumber") REFERENCES "JournalEntry"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_requestNumber_fkey" FOREIGN KEY ("requestNumber") REFERENCES "ChangeRequest"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_requestNumber_fkey" FOREIGN KEY ("requestNumber") REFERENCES "ChangeRequest"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
