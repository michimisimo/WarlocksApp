import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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

  categories = ['U 11', 'U 13', 'U 15', 'U 18'];
  activeCategory = 'U 11';

  showBack = true;
  showCat2 = true;
  showCat3 = true;

  ngOnInit() {
    // Inicializa visibilidad según el tab activo que venga del padre
    this.showCat2 = this.activeTab !== 'Plantel';
  }

  cambiarTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
    // Oculta/mostrar sub-pestañas y categorías en un solo lugar
    this.showCat2 = tab !== 'Plantel';
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
}
