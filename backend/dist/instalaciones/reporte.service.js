"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = require("pdfkit");
let ReporteService = class ReporteService {
    generarActaInstalacion(datos, res) {
        const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
        doc.on('error', (err) => {
            console.error('Error generando PDF:', err);
            if (!res.headersSent) {
                res.status(500).send('Error al generar el reporte');
            }
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Acta-${datos.numSolicitud}.pdf`);
        doc.pipe(res);
        doc.fillColor('#E31E24').fontSize(25).text('JH7 SRL', { align: 'left' });
        doc.fillColor('#444444').fontSize(10).text('Telecomunicaciones y Servicios - Oruro', { align: 'left' });
        doc.moveDown();
        doc.rect(50, doc.y, 500, 2).fill('#E31E24');
        doc.moveDown(2);
        doc.fillColor('#000000').fontSize(16).text(`ACTA DE CONFORMIDAD: ${datos.numSolicitud}`, { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#000000');
        doc.text(`Cliente: ${datos.cliente || datos.clienteNombre || 'S/N'}`);
        doc.text(`Tipo de Trabajo: ${datos.tipo || 'INSTALACION'}`);
        doc.text(`Fecha: ${new Date(datos.fecha || Date.now()).toLocaleDateString()}`);
        doc.text(`Técnico Responsable: ${datos.tecnico?.nombre || 'Personal JH7'}`);
        doc.moveDown();
        doc.fillColor('#E31E24').fontSize(14).text('Materiales Utilizados');
        doc.rect(50, doc.y, 500, 1).fillColor('#cccccc').fill();
        doc.moveDown(0.5);
        doc.fillColor('#000000');
        const listaMateriales = datos.materialesUsados || datos.materiales;
        if (listaMateriales && listaMateriales.length > 0) {
            listaMateriales.forEach((m) => {
                const nombre = m.material?.nombre || m.nombre;
                const cantidad = m.cantidad;
                const unidad = m.material?.unidad || '';
                doc.fillColor('#333333').fontSize(11).text(`- ${nombre}: ${cantidad} ${unidad}`);
            });
        }
        else {
            doc.fontSize(11).fillColor('#666666').text('No se registraron materiales extra consumidos.');
        }
        doc.moveDown();
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
        if (datos.firmaDigital || datos.firma) {
            try {
                if (doc.y > 600)
                    doc.addPage();
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
            }
            catch (error) {
                doc.moveDown(2);
                doc.rect(200, doc.y, 200, 1).fill('#000000');
                doc.fontSize(10).text('Firma Digital Registrada', { align: 'center' });
            }
        }
        else {
            doc.moveDown(4);
            doc.dash(5, { space: 2 }).moveTo(200, doc.y).lineTo(400, doc.y).stroke();
            doc.fontSize(10).text('Firma Cliente / CI', { align: 'center' });
        }
        doc.end();
    }
};
exports.ReporteService = ReporteService;
exports.ReporteService = ReporteService = __decorate([
    (0, common_1.Injectable)()
], ReporteService);
//# sourceMappingURL=reporte.service.js.map