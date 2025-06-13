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
      const puntos = lanzamientos.filter(l => l.exito === 1).reduce((sum, l) => sum + (l.punto || 0), 0);
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
    return lista;
  }

  getLanzamientos(partido: PartidoModel) {
    return partido.estadisticas.lanzamientos.map(lanz => {
      const jugador = this.jugadores.find(j => j.rut === lanz.rut);
      const nombreCompleto = jugador
        ? `${jugador.pnombre} ${jugador.appaterno}`
        : lanz.rut; // fallback a rut si no encuentra jugador

      return {
        x: lanz.coordenada_x ?? 0, // si es null, poner 0 o algún valor por defecto
        y: lanz.coordenada_y ?? 0,
        encestado: lanz.exito === 1,
        cuarto: lanz.nombre_periodo,
        jugador: nombreCompleto,
      };
    });
  }

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

  calcularTotales() {
    // Totales para tiros
    const tirosCampoTotal = this.partido!.estadisticas.lanzamientos.filter(l => l.nombre_tiro !== 'libre');
    const tirosCampoEncestados = tirosCampoTotal.filter(l => l.exito === 1);

    const triplesTotal = this.partido!.estadisticas.lanzamientos.filter(l => l.nombre_tiro === 'triple');
    const triplesEncestados = triplesTotal.filter(l => l.exito === 1);

    const libresTotal = this.partido!.estadisticas.lanzamientos.filter(l => l.nombre_tiro === 'libre');
    const libresEncestados = libresTotal.filter(l => l.exito === 1);

    // Sumar estadisticas numéricas (sumar cada propiedad)
    const sumEstadisticas = this.estadisticas!.reduce((acc, est) => {
      acc.asistencias += est.asistencias;
      acc.rebotes += est.rebotesTotales;
      acc.rebotesOfensivos += est.rebotesOfensivos;
      acc.rebotesDefensivos += est.rebotesDefensivos;
      acc.robos += est.robos;
      acc.bloqueos += est.bloqueos;
      acc.perdidas += est.perdidas;
      acc.faltas += est.faltas;
      return acc;
    }, {
      asistencias: 0,
      rebotes: 0,
      rebotesOfensivos: 0,
      rebotesDefensivos: 0,
      robos: 0,
      bloqueos: 0,
      perdidas: 0,
      faltas: 0
    });

    // Formatear %
    function porcentaje(encestados: number, intentos: number): string {
      return intentos === 0 ? '0%' : ((encestados / intentos) * 100).toFixed(1) + '%';
    }

    const datosEstadisticas = [
      { nombre: 'Tiro de campo', valor: `${tirosCampoEncestados.length}/${tirosCampoTotal.length} (${porcentaje(tirosCampoEncestados.length, tirosCampoTotal.length)})` },
      { nombre: 'Triples', valor: `${triplesEncestados.length}/${triplesTotal.length} (${porcentaje(triplesEncestados.length, triplesTotal.length)})` },
      { nombre: 'Tiros libres', valor: `${libresEncestados.length}/${libresTotal.length} (${porcentaje(libresEncestados.length, libresTotal.length)})` },
      { nombre: 'Asistencias', valor: sumEstadisticas.asistencias },
      { nombre: 'Rebotes', valor: sumEstadisticas.rebotes },
      { nombre: 'Rebotes ofensivos', valor: sumEstadisticas.rebotesOfensivos },
      { nombre: 'Rebotes defensivos', valor: sumEstadisticas.rebotesDefensivos },
      { nombre: 'Robos', valor: sumEstadisticas.robos },
      { nombre: 'Bloqueos', valor: sumEstadisticas.bloqueos },
      { nombre: 'Pérdidas de balón', valor: sumEstadisticas.perdidas },
      { nombre: 'Faltas', valor: sumEstadisticas.faltas },
    ];

    const datosResumen = [
      { nombre: 'Tiro de campo', valor: `${tirosCampoEncestados.length}/${tirosCampoTotal.length} (${porcentaje(tirosCampoEncestados.length, tirosCampoTotal.length)})` },
      { nombre: 'Triples', valor: `${triplesEncestados.length}/${triplesTotal.length} (${porcentaje(triplesEncestados.length, triplesTotal.length)})` },
      { nombre: 'Tiros libres', valor: `${libresEncestados.length}/${libresTotal.length} (${porcentaje(libresEncestados.length, libresTotal.length)})` },
    ]

    return datosEstadisticas;
  }

}
