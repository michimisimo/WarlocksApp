import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-top',
  templateUrl: './banner-top.component.html',
  styleUrls: ['./banner-top.component.scss'],
  imports: [CommonModule]
})
export class BannerTopComponent implements OnInit {

  // Se crea un Output para emitir la categoría seleccionada
  @Output() categorySelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  activeTab = 'Temporada';
  activeOrangeTab = 'Partidos';
  activeCategory = 'U 11';

  tabs = ['Temporada', 'Plantel'];
  orangeTabs = ['Partidos', 'Estadísticas del jugador'];
  categories = ['U 11', 'U 13', 'U 15', 'U 18'];

  // Función para seleccionar una pestaña
  selectTab(tab: string) {
    this.activeTab = tab;
  }

  // Función para seleccionar una pestaña naranja
  selectOrangeTab(tab: string) {
    this.activeOrangeTab = tab;
  }

  // Función para seleccionar una categoría
  selectCategory(category: string) {
    this.activeCategory = category;
    // Emitir la categoría seleccionada hacia el componente principal
    this.categorySelected.emit(category);
  }

}
