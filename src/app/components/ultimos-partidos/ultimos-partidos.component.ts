import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InfoPartido {
  contrincante: string;
  fecha: string;
  hora: string;
  id_categoria: number;
  local: boolean;
}

interface EstadisticaPartido {
  asistencias: any[];
  bloqueos: any[];
  faltas: any[];
  lanzamientos: any[];
  rebotes: {
    ofensivos: any[];
    defensivos: any[];
  };
  robos: any[];
  tiempo_juego: { minutos: number }[];
}

interface DatosPartido {
  info: InfoPartido;
  est: EstadisticaPartido;
}

@Component({
  selector: 'app-ultimos-partidos',
  templateUrl: './ultimos-partidos.component.html',
  styleUrls: ['./ultimos-partidos.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class UltimosPartidosComponent implements AfterViewInit {

  @Input() estadistica: Record<number, DatosPartido> = {};

  constructor() { }

  ngAfterViewInit() {
    console.log(this.estadistica);
  }

  calcularTotales(lanzamientos: any[], tipo: string): string {
    const total = lanzamientos.filter(l => l.nombre_tiro === tipo).length;
    const exito = lanzamientos.filter(l => l.nombre_tiro === tipo).filter(l => l.exito === 1).length

    return `${exito}/${total}`
  }

  calcularPerdidas(lanzamientos: any[], faltas: any[]): number {

    const fallido = lanzamientos.filter(l => l.exito === 0).length;
    const falta = faltas.length

    return fallido + falta;
  }
}
