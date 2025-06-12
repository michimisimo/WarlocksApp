import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-est-plantel',
  templateUrl: './est-plantel.component.html',
  styleUrls: ['./est-plantel.component.scss'],
  imports: [CommonModule]
})
export class EstPlantelComponent implements OnInit {

  totalMinutosStr: string = '00:00';

  @Input() jugadores: any[] = [];
  @Output() jugadorSeleccionado = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.calcularTotales();
  }

  /** Formatea con dos dígitos */
  padJersey(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  /** Ruta al PNG según el número (por defecto 10) */
  jerseySrc(num: number): string {
    const code = this.padJersey(num);
    return `../../../assets/poleras/${code}.png`;
  }

  onJugadorClick(jugador: any) {
    this.jugadorSeleccionado.emit(jugador);
  }

  sumarPorcentaje(jugadores: any[], campo: 't' | 't3' | 'tl'): string {
    let aciertos = 0;
    let intentos = 0;

    jugadores.forEach(j => {
      const [a, i] = j[campo].split('/').map(Number);
      aciertos += a;
      intentos += i;
    });

    return `${aciertos}/${intentos}`;
  }

  // Convierte tiempo "HH:MM:SS" o "MM:SS" a segundos
  tiempoASegundos(tiempo: string): number {
    const partes = tiempo.split(':').map(Number);
    if (partes.length === 3) {
      return partes[0] * 3600 + partes[1] * 60 + partes[2];
    } else if (partes.length === 2) {
      return partes[0] * 60 + partes[1];
    }
    return 0;
  }

  // Convierte segundos a "HH:MM:SS" o "MM:SS"
  segundosATiempo(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;

    const hh = h > 0 ? String(h).padStart(2, '0') + ':' : '';
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');

    return `${hh}${mm}:${ss}`;
  }

  calcularTotales() {
    const totalSegundos = this.jugadores.reduce((acum, j) => {
      return acum + this.tiempoASegundos(j.min);
    }, 0);

    this.totalMinutosStr = this.segundosATiempo(totalSegundos);
  }

  get totalPts() {
    return this.jugadores.reduce((a, j) => a + j.pts, 0);
  }

  get totalReb() {
    return this.jugadores.reduce((a, j) => a + j.reb, 0);
  }

  get totalAst() {
    return this.jugadores.reduce((a, j) => a + j.ast, 0);
  }

  get totalRob() {
    return this.jugadores.reduce((a, j) => a + j.rob, 0);
  }

  get totalBlq() {
    return this.jugadores.reduce((a, j) => a + j.blq, 0);
  }

  get totalPer() {
    return this.jugadores.reduce((a, j) => a + j.per, 0);
  }

  get totalFal() {
    return this.jugadores.reduce((a, j) => a + j.fal, 0);
  }

  // Para tiros, suma el numerador y denominador y arma la fracción
  private sumarTiros(tipo: 't' | 't3' | 'tl'): string {
    let sumExito = 0;
    let sumTotal = 0;
    this.jugadores.forEach(j => {
      if (j[tipo]) {
        const [exito, total] = j[tipo].split('/').map(Number);
        sumExito += exito;
        sumTotal += total;
      }
    });
    return `${sumExito}/${sumTotal}`;
  }

  get totalT() {
    return this.sumarTiros('t');
  }

  get totalT3() {
    return this.sumarTiros('t3');
  }

  get totalTL() {
    return this.sumarTiros('tl');
  }


}
