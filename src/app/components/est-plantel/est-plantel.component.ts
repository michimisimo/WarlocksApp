import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-est-plantel',
  templateUrl: './est-plantel.component.html',
  styleUrls: ['./est-plantel.component.scss'],
  imports: [CommonModule]
})
export class EstPlantelComponent implements OnInit {

  @Input() jugadores: any[] = [];
  @Output() jugadorSeleccionado = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  /** Formatea con dos dígitos */
  padJersey(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  /** Ruta al PNG según el número (por defecto 10) */
  jerseySrc(num: number): string {
    const code = this.padJersey(num);
    return `/assets/poleras/${code}.png`;
  }

  onJugadorClick(jugador: any) {
    this.jugadorSeleccionado.emit(jugador);
  }

}
