/*
  Warnings:

  - You are about to drop the column `cliente` on the `Instalacion` table. All the data in the column will be lost.
  - You are about to drop the column `materialesUsados` on the `Instalacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Equipo" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Instalacion" DROP COLUMN "cliente",
DROP COLUMN "materialesUsados";
