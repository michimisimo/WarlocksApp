import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-tiro-estadistica',
  templateUrl: './tabla-tiro-estadistica.component.html',
  styleUrls: ['./tabla-tiro-estadistica.component.scss'],
  imports: [CommonModule],
})
export class TablaTiroEstadisticaComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  gridX = Array(20).fill(0);
  gridY = Array(20).fill(0);

  // Marcador provisional con encestado = true por defecto
  lanzamientoUsuario: { x: number, y: number, encestado: boolean } | null = null;
  pendienteConfirmacion = false;
  lanzamientoTemp: { x: number, y: number } | null = null;

  @Output() lanzarConfirmado = new EventEmitter<{ x: number, y: number, encestado: boolean }>();
  @Output() cancelarLanzamiento = new EventEmitter<void>()

  prepararLanzamiento(x: number, y: number) {
    const coordX = x * 5;
    const coordY = y * 5;

    // Mostrar punto con estilo de encestado
    this.lanzamientoUsuario = {
      x: coordX,
      y: coordY,
      encestado: true
    };

    this.lanzamientoTemp = { x: coordX, y: coordY };
    this.pendienteConfirmacion = true;
  }

  confirmarLanzamiento(encestado: boolean) {
    if (!this.lanzamientoTemp) return;

    // Emitir evento al padre
    this.lanzarConfirmado.emit({
      x: this.lanzamientoTemp.x,
      y: this.lanzamientoTemp.y,
      encestado: encestado
    });

    // Ocultar punto y botones
    this.resetear();
  }

  cancelar() {
    this.resetear();
    this.cancelarLanzamiento.emit()
  }

  private resetear() {
    this.lanzamientoTemp = null;
    this.lanzamientoUsuario = null;
    this.pendienteConfirmacion = false;
  }

}