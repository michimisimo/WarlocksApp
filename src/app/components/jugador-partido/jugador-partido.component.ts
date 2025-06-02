import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-jugador-partido',
  templateUrl: './jugador-partido.component.html',
  styleUrls: ['./jugador-partido.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class JugadorPartidoComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Input() jugador: any;

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() detalleClick = new EventEmitter<void>();

  jerseySrc(numero: number): string {
    const numeroFormateado = numero < 10 ? `0${numero}` : `${numero}`;
    return `../../../assets/poleras/${numeroFormateado}.png`;
  }

  cerrar() {
    this.cerrarModal.emit();
  }

  verDetalles() {
    this.detalleClick.emit(this.jugador);
  }

  tirosJugador1 = [
    { x: 20, y: 20, acertado: true },
    { x: 15, y: 50, acertado: false },
    { x: 30, y: 70, acertado: true },
    { x: 70, y: 40, acertado: false },
    { x: 80, y: 30, acertado: true },
    { x: 75, y: 20, acertado: true },
    { x: 85, y: 15, acertado: false },
    { x: 60, y: 60, acertado: true }
  ];

}
