import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

import { SyncPartidoService } from 'src/app/services/sincronizar/sincronizar-partido/sincronizar-partido.service';
import { PartidoService } from 'src/app/services/partido/partido.service';
import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';

import { CardPartidoComponent } from 'src/app/components/card-partido/card-partido.component';
import { BannerTopComponent } from 'src/app/components/banner-top/banner-top.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    BannerTopComponent,
    CardPartidoComponent,
    IonContent,
    CommonModule,
    FormsModule
  ]
})
export class InicioPage implements OnInit, AfterViewInit {

  activeTab = 'Temporada'
  tabs = ['Temporada', 'Plantel']
  partidos: PartidoModel[] = [];
  partidosFiltrados: PartidoModel[] = [];

  constructor(
    private syncService: SyncPartidoService,
    private partidoService: PartidoService
  ) { }

  async ngOnInit() {
    // 1) Sincronizar y luego cargar desde storage
    await this.syncService.sincronizarTodos();
    const dict = await this.partidoService.obtenerTodosLosPartidos();
    this.partidos = Object.values(dict);
    // 2) Inicializar filtrados con todos
    this.partidosFiltrados = [...this.partidos];

    this.filtrarPartidosPorCategoria('U 11');
  }

  ngAfterViewInit() {
    this.componente.desactivarBack();
  }

  @ViewChild(BannerTopComponent) componente!: BannerTopComponent;

  filtrarPartidosPorCategoria(categoria: string) {
    if (categoria === 'Todas') {
      this.partidosFiltrados = [...this.partidos];
      return;
    }
    const catNum = this.getCategoriaNum(categoria);
    this.partidosFiltrados = this.partidos.filter(
      p => p.info_global.id_categoria === catNum
    );
  }

  getCategoriaNum(categoria: string): number {
    switch (categoria) {
      case 'U 11': return 1;
      case 'U 13': return 2;
      case 'U 15': return 3;
      case 'U 18': return 4;
      default: return 0;
    }
  }


}
