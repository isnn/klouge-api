-- CreateTable
CREATE TABLE "api_keys" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_device" INTEGER NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_id_device_key" ON "api_keys"("id_device");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_id_device_fkey" FOREIGN KEY ("id_device") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
