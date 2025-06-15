import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-estadistica',
  templateUrl: './banner-estadistica.component.html',
  styleUrls: ['./banner-estadistica.component.scss'],
  imports: [CommonModule,],
})
export class BannerEstadisticaComponent implements OnInit {

  @Input() activeTab = '';
  @Input() activeOTab = '';
  @Input() oTabs: string[] = [];
  @Input() fecha: string = '';
  @Input() hora: string = '';
  @Input() equipoVisitante: string = '';

  @Output() otabChanged = new EventEmitter<string>();
  @Output() categorySelected = new EventEmitter<string>();

  cuartos = ['1C', '2C', '3C', '4C', 'OT'];
  activeCuarto = '1C';

  showCat3: boolean = true;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    // Inicializa visibilidad según el tab activo que venga del padre
    this.showCat3 = this.activeTab === 'Plantel';
  }

  cambiarOTab(oTab: string) {
    this.showCat3 = oTab !== 'Plantel';
    this.activeOTab = oTab;
    this.otabChanged.emit(oTab);
  }

  selectCuarto(cat: string) {

    this.activeCuarto = cat;
    this.categorySelected.emit(cat);
  }

  //metodo para la navegacion 
  onClickConfig() {
    this.router.navigate(['/user'])
  }
  //metodo navegacion
  onClickBack() {
    this.router.navigate(['/inicio'])
  }
}
