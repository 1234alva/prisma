-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TECNICO', 'ALMACENERO');

-- CreateEnum
CREATE TYPE "SolicitudEstado" AS ENUM ('PENDIENTE', 'EJECUTADA', 'REPROGRAMADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EquipoEstado" AS ENUM ('DISPONIBLE', 'ASIGNADO', 'INSTALADO', 'DANADO', 'RECUPERADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'TECNICO',
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "cantidadTotal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTecnico" (
    "id" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "asignado" INTEGER NOT NULL DEFAULT 0,
    "utilizado" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StockTecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "sn" TEXT,
    "mac" TEXT,
    "estado" "EquipoEstado" NOT NULL DEFAULT 'DISPONIBLE',
    "marca" TEXT DEFAULT 'GENERICA',
    "modelo" TEXT DEFAULT 'RECUPERADO',
    "fuente" BOOLEAN NOT NULL DEFAULT true,
    "hdmi" BOOLEAN NOT NULL DEFAULT false,
    "patchcord_sc" BOOLEAN NOT NULL DEFAULT false,
    "patchcord_utp" BOOLEAN NOT NULL DEFAULT false,
    "poseedorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instalacion" (
    "id" TEXT NOT NULL,
    "numSolicitud" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" "SolicitudEstado" NOT NULL DEFAULT 'EJECUTADA',
    "observacion" TEXT,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "fotos" TEXT[],
    "firmaDigital" TEXT,
    "router_sn" TEXT,
    "iptv_macs" TEXT[],
    "tecnicoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instalacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipoRecuperado" (
    "id" TEXT NOT NULL,
    "numSolicitud" TEXT NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "tecnicoCelular" TEXT,
    "fechaRetiro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sn_mac" TEXT NOT NULL,
    "mac_deco" TEXT,
    "tipo_servicio" TEXT NOT NULL DEFAULT 'ROUTER',
    "estadoEquipo" TEXT NOT NULL,
    "accesorios" TEXT NOT NULL DEFAULT 'Completo',
    "observaciones" TEXT,
    "firmaDigital" TEXT,
    "tecnicoId" TEXT NOT NULL,

    CONSTRAINT "EquipoRecuperado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Herramienta" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "poseedorId" TEXT,

    CONSTRAINT "Herramienta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id" TEXT NOT NULL,
    "numSolicitud" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Material_nombre_key" ON "Material"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "StockTecnico_tecnicoId_materialId_key" ON "StockTecnico"("tecnicoId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_sn_key" ON "Equipo"("sn");

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_mac_key" ON "Equipo"("mac");

-- CreateIndex
CREATE UNIQUE INDEX "Instalacion_numSolicitud_key" ON "Instalacion"("numSolicitud");

-- AddForeignKey
ALTER TABLE "StockTecnico" ADD CONSTRAINT "StockTecnico_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTecnico" ADD CONSTRAINT "StockTecnico_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_poseedorId_fkey" FOREIGN KEY ("poseedorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instalacion" ADD CONSTRAINT "Instalacion_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipoRecuperado" ADD CONSTRAINT "EquipoRecuperado_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Herramienta" ADD CONSTRAINT "Herramienta_poseedorId_fkey" FOREIGN KEY ("poseedorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
