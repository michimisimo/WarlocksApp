export interface RawPartido {
  id_partido: number;
  contrincante: string;
  fecha: string;
  hora: string;
  id_categoria: number;
  local_: 0 | 1;
}

export interface PartidoModel {
  id_partido: number;
  info_global: {
    fecha: string;
    hora: string;
    local: boolean;
    contrincante: string;
    id_categoria: number;
    resultado_final?: { nuestro_equipo: number; rival: number };
  };
  estadisticas: {
    lanzamientos: any[];
    rebotes: { ofensivos: any[]; defensivos: any[] };
    asistencias: any[];
    robos: any[];
    faltas: any[];
    perdidas: any[];
    bloqueos: any[];
    tiempo_juego: any[];
  };
  version: number;
}

export function mapRawToPartido(raw: RawPartido, version = 0): PartidoModel {
  return {
    id_partido: raw.id_partido,
    info_global: {
      fecha: raw.fecha,
      hora: raw.hora,
      local: Boolean(raw.local_),
      contrincante: raw.contrincante,
      id_categoria: raw.id_categoria
    },
    estadisticas: {
      lanzamientos: [],
      rebotes: { ofensivos: [], defensivos: [] },
      asistencias: [],
      robos: [],
      faltas: [],
      perdidas: [],
      bloqueos: [],
      tiempo_juego: []
    },
    version
  };
}