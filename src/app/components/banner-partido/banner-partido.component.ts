import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';

@Component({
  selector: 'app-banner-partido',
  templateUrl: './banner-partido.component.html',
  styleUrls: ['./banner-partido.component.scss'],
  imports: [CommonModule,]
})
export class BannerPartidoComponent implements OnInit {

  partido: PartidoModel | undefined;
  tabs = ['Resumen', 'Alineación', 'Estadísticas']
  activeTab = 'Resumen';

  showBack = true;

  @Input() fecha: string = '';
  @Input() hora: string = '';
  @Input() equipoVisitante: string = '';
  @Output() tabChanged = new EventEmitter<string>();

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }

  cambiarTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
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
