import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';
import { BannerPartidoComponent } from 'src/app/components/banner-partido/banner-partido.component';
import { EstPlantelComponent } from 'src/app/components/est-plantel/est-plantel.component';
import { EstPartidoComponent } from 'src/app/components/est-partido/est-partido.component';
import { ResumenEstadisticaComponent } from 'src/app/components/resumen-estadistica/resumen-estadistica.component';
import { MarcadorComponent } from 'src/app/components/marcador/marcador.component';
import { TablaTiroComponent } from 'src/app/components/tabla-tiro/tabla-tiro.component';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,
    BannerPartidoComponent,
    EstPlantelComponent,
    EstPartidoComponent,
    ResumenEstadisticaComponent,
    MarcadorComponent,
    TablaTiroComponent
  ]
})
export class PartidoPage implements OnInit {

  partido: PartidoModel | undefined;
  activeTab: string = "Resumen"

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
    const navigation = history.state;
    if (navigation && navigation.partido) {
      this.partido = navigation.partido;
      console.log(this.partido)
    }
  }

  selectedTab(tab: any) {
    console.log(tab)
    this.activeTab = tab;
  }

  onVerMas() {
    this.activeTab = 'Estadísticas'
  }

  listaJugadores = [
    {
      numero: 1,
      apellido: 'Jugador1',
      posicion: 'Base',
      min: '25:58',
      minNum: 25.97,
      pts: 14,
      reb: 1,
      ast: 9,
      rob: 2,
      blq: 0,
      per: 3,
      t: '5/12',
      t3: '1/3',
      tl: '3/4',
      fal: 1
    },
    {
      numero: 2,
      apellido: 'Jugador2',
      posicion: 'Escolta',
      min: '16:33',
      minNum: 16.55,
      pts: 6,
      reb: 5,
      ast: 2,
      rob: 1,
      blq: 0,
      per: 0,
      t: '2/5',
      t3: '0/3',
      tl: '2/2',
      fal: 1
    },
    {
      numero: 3,
      apellido: 'Jugador3',
      posicion: 'Alero',
      min: '15:46',
      minNum: 15.77,
      pts: 3,
      reb: 1,
      ast: 0,
      rob: 1,
      blq: 0,
      per: 2,
      t: '1/6',
      t3: '0/2',
      tl: '3/4',
      fal: 1
    },
    {
      numero: 4,
      apellido: 'Jugador4',
      posicion: 'Ala-Pívot',
      min: '23:11',
      minNum: 23.18,
      pts: 9,
      reb: 3,
      ast: 1,
      rob: 2,
      blq: 0,
      per: 2,
      t: '2/7',
      t3: '1/4',
      tl: '4/6',
      fal: 1
    },
    {
      numero: 5,
      apellido: 'Jugador5',
      posicion: 'Pívot',
      min: '15:12',
      minNum: 15.2,
      pts: 10,
      reb: 5,
      ast: 0,
      rob: 0,
      blq: 3,
      per: 3,
      t: '4/8',
      t3: '2/4',
      tl: '0/0',
      fal: 1
    }
  ];

  verDetalle(jugador: any) {
    console.log('Jugador clicado:', jugador);
  }

  datosEstadisticas = [
    { nombre: 'Tiro de campo', valor: '39/86 (45.3%)' },
    { nombre: 'Triples', valor: '18/47 (38.3%)' },
    { nombre: 'Tiros libres', valor: '26/31 (87.0%)' },
    { nombre: 'Asistencias', valor: 19 },
    { nombre: 'Rebotes', valor: 64 },
    { nombre: 'Rebotes ofensivos', valor: 17 },
    { nombre: 'Rebotes defensivos', valor: 47 },
    { nombre: 'Robos', valor: 4 },
    { nombre: 'Bloqueos', valor: 3 },
    { nombre: 'Pérdidas de balón', valor: 64 },
    { nombre: 'Faltas', valor: 18 }
  ];

}
