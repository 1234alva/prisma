export class CreateInstalacionDto {
  numSolicitud: string;
  tipo: 'SIMPLE' | 'IPTV';
  router_sn?: string;
  iptv_macs?: string[];
  latitud: number;
  longitud: number;
  fotos: string[]; // Base64
  tecnicoId: string;
}