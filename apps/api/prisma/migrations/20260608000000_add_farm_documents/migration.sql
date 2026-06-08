-- CreateTable
CREATE TABLE "farm_documents" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID NOT NULL,
    "tenant_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "description" TEXT,
    "s3_key" VARCHAR(1024) NOT NULL,
    "file_name" VARCHAR(512) NOT NULL,
    "content_type" VARCHAR(255),
    "file_size" INTEGER,
    "uploaded_by" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),

    CONSTRAINT "farm_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_farm_documents_farm_id" ON "farm_documents"("farm_id");

-- AddForeignKey
ALTER TABLE "farm_documents" ADD CONSTRAINT "farm_documents_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
