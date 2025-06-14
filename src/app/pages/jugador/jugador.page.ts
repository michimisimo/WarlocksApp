import { Component, OnInit } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

import { BannerJugadorComponent } from 'src/app/components/banner-jugador/banner-jugador.component';
import { UltimosPartidosComponent } from 'src/app/components/ultimos-partidos/ultimos-partidos.component';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';

import { SincronizarEstadisticaService } from 'src/app/services/sincronizar/sincronizar-estadistica/sincronizar-estadistica.service';
import { PartidoService } from 'src/app/services/partido/partido.service';

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.page.html',
  styleUrls: ['./jugador.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterModule,
    BannerJugadorComponent,
    UltimosPartidosComponent
  ]
})
export class JugadorPage implements OnInit {

  partidos: PartidoModel[] = []
  jugador: TeamMember | undefined
  activeTab: string = "Temporada"
  estadistica: any;

  constructor(
    private location: Location,
    private router: Router,
    private syncEstadistica: SincronizarEstadisticaService,
    private partidoService: PartidoService,
  ) { }

  async ngOnInit(): Promise<void> {
    const navigation = history.state;
    if (navigation && navigation.jugador) {
      this.jugador = navigation.jugador;
      console.log(this.jugador)
      this.estadistica = await this.syncEstadistica.getEstadisticaByJugador(this.jugador!.rut)
      this.agruparEstadisticasPorPartido()
    }
  }

  onTabChanged(tab: string) {
    console.log(tab);
    this.activeTab = tab
  }


  async agruparEstadisticasPorPartido() {
    const agrupado: any = {};

    const idsPartidos = this.estadistica.nomina.map((n: any) => n.id_partido);

    const partidosData = await Promise.all(
      idsPartidos.map((id: number) => this.partidoService.obtenerPartido(id.toString()))
    );

    for (const partidos of this.estadistica.nomina) {
      const id_partido = partidos.id_partido;

      const partido = partidosData.find((p: any) => p.id_partido === id_partido);
      const info_global = partido?.info_global || null;
      agrupado[id_partido] = {
        est: {
          asistencias: this.estadistica.estadisticas.asistencias.filter((e: any) => e.id_partido === id_partido),
          bloqueos: this.estadistica.estadisticas.bloqueos.filter((e: any) => e.id_partido === id_partido),
          faltas: this.estadistica.estadisticas.faltas.filter((e: any) => e.id_partido === id_partido),
          lanzamientos: this.estadistica.estadisticas.lanzamientos.filter((e: any) => e.id_partido === id_partido),
          rebotes: {
            ofensivos: this.estadistica.estadisticas.rebotes.ofensivos.filter((e: any) => e.id_partido === id_partido),
            defensivos: this.estadistica.estadisticas.rebotes.defensivos.filter((e: any) => e.id_partido === id_partido)
          },
          robos: this.estadistica.estadisticas.robos.filter((e: any) => e.id_partido === id_partido),
          tiempo_juego: this.estadistica.estadisticas.tiempo_juego.filter((e: any) => e.id_partido === id_partido),
        },
        info: info_global
      };
    }
    console.log(agrupado)
    return agrupado;
  }


}
