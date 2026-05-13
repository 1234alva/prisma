-- AlterTable
ALTER TABLE "Instalacion" ADD COLUMN     "cliente" TEXT NOT NULL DEFAULT 'Cliente Nuevo',
ADD COLUMN     "materialesUsados" JSONB;
