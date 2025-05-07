import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSegment, IonSegmentButton, IonLabel, IonButton, IonAccordion, IonItem, IonAccordionGroup, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

interface Lanzamiento {
  x: number;
  y: number;
  encestado: boolean;
  cuarto: string; // '1C', '2C', '3C', '4C', 'OT'
  jugador: string;
}

@Component({
  selector: 'app-tabla-tiro',
  templateUrl: './tabla-tiro.component.html',
  styleUrls: ['./tabla-tiro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSegment, IonSegmentButton, IonLabel, IonButton, IonAccordion, IonItem, IonAccordionGroup, IonSelect, IonSelectOption]
})
export class TablaTiroComponent implements OnChanges {

  constructor() { }

  @Input() lanzamientos: Lanzamiento[] = [];
  @Input() filtroCuarto: string = 'Todos';
  @Input() filtroJugador: string = 'Todos';

  lanzamientosFiltrados: Lanzamiento[] = [];
  jugadores: string[] = [];

  ngOnChanges() {
    this.aplicarFiltros();
    this.actualizarJugadores();
  }

  actualizarJugadores() {
    const todos = this.lanzamientos.map(l => l.jugador);
    const unicos = Array.from(new Set(todos));
    this.jugadores = unicos.sort(); // Opcional: ordena alfabéticamente
  }


  cambiarJugador(event: any) {
    this.filtroJugador = event.detail.value;
    this.aplicarFiltros();
  }

  seleccionarJugador(jugador: string) {
    this.filtroJugador = jugador;
    this.aplicarFiltros();

    const accordionGroup = document.querySelector('ion-accordion-group');
    const accordion = accordionGroup?.querySelector('ion-accordion');
    if (accordion) {
      accordionGroup!.value = undefined; // Cierra el acordeón
    }
  }

  cambiarCuarto(event: any) {
    this.filtroCuarto = event.detail.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.lanzamientosFiltrados = this.lanzamientos.filter(l => {
      const matchCuarto = this.filtroCuarto === 'Todos' || l.cuarto === this.filtroCuarto;
      const matchJugador = this.filtroJugador === 'Todos' || l.jugador === this.filtroJugador;
      return matchCuarto && matchJugador;
    });
  }

}
