import { Component, OnInit, Output, EventEmitter, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-top',
  templateUrl: './banner-top.component.html',
  styleUrls: ['./banner-top.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BannerTopComponent implements OnInit {
  @Input() activeTab = '';
  @Input() activeOTab = '';
  @Input() tabs: string[] = [];
  @Input() oTabs: string[] = [];

  @Output() tabChanged = new EventEmitter<string>();
  @Output() otabChanged = new EventEmitter<string>();
  @Output() categorySelected = new EventEmitter<string>();
  @Output() abrirConfiguracion = new EventEmitter<void>(); // evento para la navegacion
  @Output() volverAInicio = new EventEmitter<void>(); // evento para volver

  categories = ['U11', 'U13', 'U15', 'U18'];
  activeCategory = 'U11';

  showBack = true;
  showCat2 = true;
  showCat3: boolean = true;

  ngOnInit() {
    // Inicializa visibilidad según el tab activo que venga del padre
    this.showCat2 = this.activeTab !== 'Plantel';
    this.showCat3 = this.activeTab !== 'Mi Cuenta';
  }

  cambiarTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
    // Oculta/mostrar sub-pestañas y categorías en un solo lugar
    this.showCat2 = tab !== 'Plantel';
    this.showCat3 = tab !== 'Mi cuenta';
  }

  cambiarOTab(oTab: string) {
    this.activeOTab = oTab;
    this.otabChanged.emit(oTab);
  }

  selectCategory(cat: string) {
    this.activeCategory = cat;
    this.categorySelected.emit(cat);
  }

  // Si necesitas ocultar el back button desde afuera
  desactivarBack() {
    this.showBack = false;
  }

  //metodo para la navegacion 
  onClickConfig() {
    this.abrirConfiguracion.emit()
  }
  //metodo navegacion
  onClickBack() {
    this.volverAInicio.emit()
  }
}
