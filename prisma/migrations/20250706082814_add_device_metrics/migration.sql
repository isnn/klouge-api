-- CreateTable
CREATE TABLE "device_metrics" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "id_device" INTEGER NOT NULL,
    "metrics" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "device_metrics_metrics_idx" ON "device_metrics" USING GIN ("metrics" jsonb_path_ops);

-- AddForeignKey
ALTER TABLE "device_metrics" ADD CONSTRAINT "device_metrics_id_device_fkey" FOREIGN KEY ("id_device") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
