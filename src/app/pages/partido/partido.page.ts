import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';
import { BannerPartidoComponent } from 'src/app/components/banner-partido/banner-partido.component';
import { EstPlantelComponent } from 'src/app/components/est-plantel/est-plantel.component';
import { EstPartidoComponent } from 'src/app/components/est-partido/est-partido.component';
import { ResumenEstadisticaComponent } from 'src/app/components/resumen-estadistica/resumen-estadistica.component';
import { MarcadorComponent } from 'src/app/components/marcador/marcador.component';
import { TablaTiroComponent } from 'src/app/components/tabla-tiro/tabla-tiro.component';
import { JugadorPartidoComponent } from 'src/app/components/jugador-partido/jugador-partido.component';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { SincronizarEstadisticaService } from 'src/app/services/sincronizar/sincronizar-estadistica/sincronizar-estadistica.service';
import { PartidoService } from 'src/app/services/partido/partido.service';

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
    TablaTiroComponent,
    JugadorPartidoComponent,
  ]
})
export class PartidoPage implements OnInit {

  partido: PartidoModel | null = null;
  activeTab: string = "Resumen"
  jugadorSeleccionado: boolean = false;
  jugadorDetalle: TeamMember | undefined;

  constructor(
    private location: Location,
    private router: Router,
    private syncEstService: SincronizarEstadisticaService,
    private partidoService: PartidoService,

  ) { }

  async ngOnInit(): Promise<void> {
    const navigation = history.state;

    if (navigation && navigation.partido) {
      this.partido = navigation.partido;
      console.log('Partido recibido por navigation:', this.partido);
    }

    await this.syncEstService.descargarEstadistica(this.partido!.id_partido!.toString());

    // Esperar el partido actualizado desde el storage
    this.partido = await this.partidoService.obtenerPartido(this.partido!.id_partido!.toString());
    console.log('Partido visualizado:', this.partido);
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

  listaTiros = [
    { x: 20, y: 10, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 20, y: 10, encestado: false, cuarto: '1C', jugador: 'Felipe' },
    { x: 55, y: 80, encestado: true, cuarto: '2C', jugador: 'Jean' },
    { x: 30, y: 15, encestado: false, cuarto: '1C', jugador: 'Felipe' },
    { x: 40, y: 25, encestado: true, cuarto: '2C', jugador: 'Jean' },
    { x: 60, y: 70, encestado: false, cuarto: '3C', jugador: 'Laura' },
    { x: 65, y: 75, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 70, y: 20, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 10, y: 90, encestado: true, cuarto: '2C', jugador: 'Felipe' },
    { x: 50, y: 50, encestado: true, cuarto: '1C', jugador: 'Jean' },
    { x: 25, y: 40, encestado: false, cuarto: '3C', jugador: 'Laura' },
    { x: 80, y: 60, encestado: true, cuarto: '4C', jugador: 'Carlos' },
    { x: 15, y: 35, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 45, y: 55, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 75, y: 65, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 35, y: 30, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 90, y: 10, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 12, y: 22, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 52, y: 72, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 62, y: 82, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 18, y: 48, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 28, y: 58, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 38, y: 68, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 48, y: 78, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 58, y: 88, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 68, y: 18, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 78, y: 28, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 88, y: 38, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 95, y: 48, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 20, y: 60, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 30, y: 70, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 40, y: 80, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 50, y: 90, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 60, y: 10, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 70, y: 20, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 80, y: 30, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 90, y: 40, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 25, y: 50, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 35, y: 60, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 45, y: 70, encestado: false, cuarto: '4C', jugador: 'Carlos' }
  ];

  verDetalle(jugador: any) {
    this.jugadorSeleccionado = true;
    this.jugadorDetalle = jugador;
    console.log('Jugador clicado:', jugador);
  }

  onCerrarModal() {
    this.jugadorSeleccionado = false;
  }

  onDetalleClick() {
    this.router.navigate(['/jugador'], { state: { jugador: this.jugadorDetalle } });

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
