import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const usuarios = [
    { nombre: 'Henry Eulate', username: 'henry.eulate', rol: Role.ADMIN },
    { nombre: 'Marcelo Manzaneda', username: 'marcelo.manzaneda', rol: Role.ALMACENERO },
    { nombre: 'Aron Quispe', username: 'aron.quispe', rol: Role.ADMIN },
    { nombre: 'Armin Lutina', username: 'armin.lutina', rol: Role.TECNICO },
    { nombre: 'Moises Mamani', username: 'moises.mamani', rol: Role.TECNICO },
    { nombre: 'Omar Rodriguez', username: 'omar.rodriguez', rol: Role.TECNICO },
    { nombre: 'Brayan Salvatierra', username: 'brayan.salvatierra', rol: Role.TECNICO },
    { nombre: 'Gustavo Lopez', username: 'gustavo.lopez', rol: Role.TECNICO },
    { nombre: 'Juan Laime', username: 'juan.laime', rol: Role.TECNICO },
    { nombre: 'Agustin Molina', username: 'agustin.molina', rol: Role.TECNICO },
    { nombre: 'Fernando Reynaga', username: 'fernando.reynaga', rol: Role.TECNICO },
    { nombre: 'Richar Duglas', username: 'richar.duglas', rol: Role.TECNICO },
    { nombre: 'Miguel Miranda', username: 'miguel.miranda', rol: Role.TECNICO },
    { nombre: 'Alejandro Alanes', username: 'alejandro.alanes', rol: Role.TECNICO },
    { nombre: 'Joel Canaviri', username: 'joel.canaviri', rol: Role.TECNICO },
  ];

  console.log('Sembrando usuarios...');
  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { username: u.username },
      update: {},
      create: {
        nombre: u.nombre,
        username: u.username,
        password: passwordHash,
        rol: u.rol,
        activo: false 
      },
    });
  }

  const materiales = [
    { nombre: 'Cable Drop', cantidadTotal: 500, unidad: 'Metros' },
    { nombre: 'Tensor', cantidadTotal: 200, unidad: 'Piezas' },
    { nombre: 'PASH SC', cantidadTotal: 300, unidad: 'Piezas' },
    { nombre: 'PASH UTP', cantidadTotal: 300, unidad: 'Piezas' },
    { nombre: 'Conector SC', cantidadTotal: 400, unidad: 'Piezas' },
    { nombre: 'Roseta SC', cantidadTotal: 250, unidad: 'Piezas' },
    { nombre: 'IPTV', cantidadTotal: 50, unidad: 'Equipos' },
    { nombre: 'Cable UTP', cantidadTotal: 500, unidad: 'Metros' },
    { nombre: 'Conector RJ45', cantidadTotal: 400, unidad: 'Piezas' },
  ];

  console.log('Sembrando materiales...');
  for (const m of materiales) {
    await prisma.material.upsert({
      where: { nombre: m.nombre },
      update: { cantidadTotal: m.cantidadTotal },
      create: m,
    });
  }

  
  const equipos = [
    { 
      tipo: 'ROUTER', 
      sn: '485754344D9029AE', 
      estado: 'DISPONIBLE' as any 
    },
    { 
      tipo: 'ROUTER', 
      sn: '485754344D9066AE', 
      estado: 'DISPONIBLE' as any 
    },
    { 
      tipo: 'IPTV', 
      mac: 'AA:BB:CC:DD:EE:01',
      estado: 'DISPONIBLE' as any
    },
  ];

  console.log('Sembrando equipos...');
  for (const eq of equipos) {
    await prisma.equipo.upsert({
      where: eq.sn ? { sn: eq.sn } : { mac: eq.mac! },
      update: {},
      create: eq,
    });
  }

  console.log(' Base de datos de JH7 sincronizada y cargada.');
}

main()
  .catch((e) => {
    console.error(e);
    //process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });