import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Response } from 'express';


@Injectable()
export class ReporteService {
  generarActaInstalacion(datos: any, res: Response) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    doc.on('error', (err) => {
      console.error('Error generando PDF:', err);
      if (!res.headersSent) {
        res.status(500).send('Error al generar el reporte');
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Acta-${datos.numSolicitud}.pdf`);

    doc.pipe(res);

    // --- ENCABEZADO ESTILO JH7 ---
    doc.fillColor('#E31E24').fontSize(25).text('JH7 SRL', { align: 'left' });
    doc.fillColor('#444444').fontSize(10).text('Telecomunicaciones y Servicios - Oruro', { align: 'left' });
    doc.moveDown();
    
    doc.rect(50, doc.y, 500, 2).fill('#E31E24'); 
    doc.moveDown(2);

    // --- TÍTULO Y DATOS DEL CLIENTE ---
    doc.fillColor('#000000').fontSize(16).text(`ACTA DE CONFORMIDAD: ${datos.numSolicitud}`, { underline: true });
    doc.moveDown();
    
    doc.fontSize(12).fillColor('#000000');
    // Usamos cliente o clienteNombre dependiendo de qué llegue
    doc.text(`Cliente: ${datos.cliente || datos.clienteNombre || 'S/N'}`);
    doc.text(`Tipo de Trabajo: ${datos.tipo || 'INSTALACION'}`);
    doc.text(`Fecha: ${new Date(datos.fecha || Date.now()).toLocaleDateString()}`);
    doc.text(`Técnico Responsable: ${datos.tecnico?.nombre || 'Personal JH7'}`);
    doc.moveDown();

    // --- SECCIÓN MATERIALES (Sincronizado con Prisma) ---
    doc.fillColor('#E31E24').fontSize(14).text('Materiales Utilizados');
    doc.rect(50, doc.y, 500, 1).fillColor('#cccccc').fill();
    doc.moveDown(0.5);
    doc.fillColor('#000000');

    // Adaptamos a la relación materialesUsados de tu esquema
    const listaMateriales = datos.materialesUsados || datos.materiales;
    if (listaMateriales && listaMateriales.length > 0) {
      listaMateriales.forEach((m: any) => {
        const nombre = m.material?.nombre || m.nombre;
        const cantidad = m.cantidad;
        const unidad = m.material?.unidad || '';
        doc.fillColor('#333333').fontSize(11).text(`- ${nombre}: ${cantidad} ${unidad}`);
      });
    } else {
      doc.fontSize(11).fillColor('#666666').text('No se registraron materiales extra consumidos.');
    }
    doc.moveDown();

    // --- SECCIÓN EQUIPO ---
    if (datos.router_sn || datos.equipo) {
      doc.fillColor('#E31E24').fontSize(14).text('Equipo Instalado');
      doc.rect(50, doc.y, 500, 1).fillColor('#cccccc').fill();
      doc.moveDown(0.5);
      doc.fillColor('#000000');
      
      const sn = datos.router_sn || datos.equipo?.sn || 'N/A';
      doc.fontSize(11).text(`Hardware: ONT / Router`);
      doc.text(`Número de Serie (S/N): ${sn}`);
      
      if (datos.iptv_macs && datos.iptv_macs.length > 0) {
        doc.text(`Decodificadores IPTV (MAC): ${datos.iptv_macs.join(', ')}`);
      }
      doc.moveDown();
    }

    // --- SECCIÓN FIRMA ---
    // Si viene la firma en Base64 la pintamos, si no, dejamos el espacio para firma manual
    if (datos.firmaDigital || datos.firma) {
      try {
        if (doc.y > 600) doc.addPage();
        doc.moveDown(2);
        doc.fontSize(12).text('Firma de Conformidad del Cliente:', { align: 'center' });
        doc.moveDown();

        const rawFirma = datos.firmaDigital || datos.firma;
        const base64Data = rawFirma.includes(',') ? rawFirma.split(',')[1] : rawFirma;
        const bufferFirma = Buffer.from(base64Data, 'base64');

        doc.image(bufferFirma, { 
          fit: [200, 100], 
          align: 'center' 
        });
      } catch (error) {
        doc.moveDown(2);
        doc.rect(200, doc.y, 200, 1).fill('#000000');
        doc.fontSize(10).text('Firma Digital Registrada', { align: 'center' });
      }
    } else {
        // Espacio para firma física si no hay digital
        doc.moveDown(4);
        doc.dash(5, { space: 2 }).moveTo(200, doc.y).lineTo(400, doc.y).stroke();
        doc.fontSize(10).text('Firma Cliente / CI', { align: 'center' });
    }

    doc.end();
  }
}