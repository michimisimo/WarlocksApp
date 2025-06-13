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
  @Input() tirosJugador: any;

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


}
