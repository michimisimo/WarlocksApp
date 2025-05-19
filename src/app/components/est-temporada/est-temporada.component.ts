import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface StatEntry {
  name: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'app-est-temporada',
  templateUrl: './est-temporada.component.html',
  styleUrls: ['./est-temporada.component.scss'],
  imports: [CommonModule, IonicModule,]
})
export class EstTemporadaComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  /** Título de la tabla (p.ej. 'Puntos', 'Asistencias') */
  @Input() title: string = '';
  /** Lista completa de entradas */
  @Input() entries: StatEntry[] = [];
  /** Cuántos mostrar en modo recortado */
  @Input() limit: number = 3;
  /** Texto del botón inferior */
  @Input() showAllText: string = 'Mostrar todo';

  /** Flag interno para alternar vista completa/limitada */
  showAllMode = false;

  /** Devuelve sólo los primeros `limit` o todos, según el flag */
  get visibleEntries(): StatEntry[] {
    return this.showAllMode ? this.entries : this.entries.slice(0, this.limit);
  }

  toggleShowAll() {
    this.showAllMode = !this.showAllMode;
  }

}
