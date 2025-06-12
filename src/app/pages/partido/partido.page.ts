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
import { MiembrosService } from 'src/app/services/miembros/miembros.service';

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
  jugadores: TeamMember[] = []

  estadisticas: {
    rut: any;
    minutos: any;
    puntos: any;
    asistencias: number;
    robos: number;
    bloqueos: number;
    faltas: number;
    perdidas: number;
    rebotesOfensivos: number;
    rebotesDefensivos: number;
    rebotesTotales: number;
    t: string;
    tl: string;
    t3: string;
  }[] | undefined;

  constructor(
    private location: Location,
    private router: Router,
    private syncEstService: SincronizarEstadisticaService,
    private partidoService: PartidoService,
    private miembroService: MiembrosService

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
    this.estadisticas = this.getEstadisticas(this.partido!);
    this.jugadores = await this.getJugadores(this.partido!);
    console.log(this.jugadores)
  }

  selectedTab(tab: any) {
    console.log(tab)
    this.activeTab = tab;
  }

  onVerMas() {
    this.activeTab = 'Estadísticas'
  }

  async getJugadores(partido: PartidoModel): Promise<TeamMember[]> {
    const jugadores = await Promise.all(
      partido.nomina.map(jugador => this.miembroService.getMember(jugador.rut))
    );
    return jugadores.filter((j): j is TeamMember => j !== null);
  }


  getEstadisticas(partido: PartidoModel) {
    const jugadoresConEstadisticas = this.partido?.nomina.map(jugador => {

      const rut = jugador.rut;

      const tiempoJugador = partido.estadisticas.tiempo_juego.find(t => t.rut === rut);
      const minutos = tiempoJugador?.minutos || '00:00:00';

      // Lanzamientos
      const lanzamientos = partido.estadisticas.lanzamientos.filter(l => l.rut === rut);
      const puntos = lanzamientos.reduce((sum, l) => sum + (l.punto || 0), 0);
      const tipoTiro = (nombre: string) => lanzamientos.filter(l => l.nombre_tiro === nombre);

      const calcularTiro = (nombre: string) => {
        const tiros = tipoTiro(nombre);
        const aciertos = tiros.filter(t => t.exito === 1).length;
        return `${aciertos}/${tiros.length}`;
      };

      const t = calcularTiro('doble');    // tiros de 2
      const t3 = calcularTiro('triple');  // tiros de 3
      const tl = calcularTiro('libre');   // tiros libres

      // Asistencias
      const asistencias = partido.estadisticas.asistencias.filter(a => a.rut === rut).length;

      // Robos
      const robos = partido.estadisticas.robos.filter(r => r.rut === rut).length;

      // Bloqueos
      const bloqueos = partido.estadisticas.bloqueos.filter(b => b.rut === rut).length;

      // Faltas
      const faltas = partido.estadisticas.faltas.filter(f => f.rut === rut).length;

      // Rebotes
      const rebotesOfensivos = partido.estadisticas.rebotes.ofensivos.filter(r => r.rut === rut).length;
      const rebotesDefensivos = partido.estadisticas.rebotes.defensivos.filter(r => r.rut === rut).length;
      const perdidas = lanzamientos.filter(l => l.exito === 0).length + faltas;

      return {
        rut,
        minutos,
        puntos,
        asistencias,
        robos,
        bloqueos,
        faltas,
        rebotesOfensivos,
        rebotesDefensivos,
        rebotesTotales: rebotesOfensivos + rebotesDefensivos,
        t,
        tl,
        t3,
        perdidas
      };
    });

    console.log(jugadoresConEstadisticas);
    return jugadoresConEstadisticas;
  }

  getListaJugadores(partido: PartidoModel) {
    const lista = this.jugadores.map(jugador => {
      const stats = this.estadisticas!.find(e => e.rut === jugador.rut);

      // Si no hay stats, usamos valores por defecto
      if (!stats) {
        return {
          numero: jugador.numero,
          apellido: jugador.appaterno,
          posicion: jugador.posicion,
          min: '00:00:00',
          minNum: 0,
          pts: 0,
          reb: 0,
          ast: 0,
          rob: 0,
          blq: 0,
          per: 0,
          t: '0/0',
          t3: '0/0',
          tl: '0/0',
          fal: 0
        };
      }

      // Conversión de minutos "hh:mm:ss" a número decimal
      const partes = stats.minutos.split(':').map(Number);
      const minutosDecimales = partes[0] * 60 + partes[1] + partes[2] / 60;

      return {
        numero: jugador.numero,
        inicial: jugador.pnombre?.substring(0, 1),
        apellido: jugador.appaterno,
        posicion: jugador.posicion,
        min: stats.minutos,
        minNum: parseFloat(minutosDecimales.toFixed(2)),
        pts: stats.puntos,
        reb: stats.rebotesTotales,
        ast: stats.asistencias,
        rob: stats.robos,
        blq: stats.bloqueos,
        per: stats.perdidas,
        t: stats.t,
        t3: stats.t3,
        tl: stats.tl,
        fal: stats.faltas
      };
    });
    console.log("lista jugadores: ", lista)
    return lista;
  }

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
