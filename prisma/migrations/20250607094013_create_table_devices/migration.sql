-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
