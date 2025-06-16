import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';

import { BannerEstadisticaComponent } from 'src/app/components/banner-estadistica/banner-estadistica.component';
import { TableSeleccionarPlantelComponent } from 'src/app/components/table-seleccionar-plantel/table-seleccionar-plantel.component';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,
    BannerEstadisticaComponent,
    TableSeleccionarPlantelComponent,
  ]
})
export class EstadisticaPage implements OnInit {

  partido: PartidoModel | null = null;
  activeTab: string = "Plantel"
  tabs = ['Plantel', 'Etadistica']
  cuarto: string = '1C'

  constructor(
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit() {
    const navigation = history.state;

    if (navigation && navigation.partido) {
      this.partido = navigation.partido;
      console.log('Partido recibido por navigation:', this.partido);
    }
  }

  selectedTab(tab: any) {
    console.log(tab)
    this.activeTab = tab;
  }

  selectedCuarto(cuarto: string) {
    this.cuarto = cuarto
    console.log(this.cuarto)

  }

  actualizarEntrenadores(lista: TeamMember[]) {
    console.log('Entrenadores actualizados:', lista);
    // Aquí puedes guardarlo, validarlo, etc.
  }

  actualizarJugadores(lista: TeamMember[]) {
    console.log('Jugadores actualizados:', lista);
  }

}
