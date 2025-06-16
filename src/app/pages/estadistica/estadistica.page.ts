import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { PartidoService } from 'src/app/services/partido/partido.service';

import { BannerEstadisticaComponent } from 'src/app/components/banner-estadistica/banner-estadistica.component';
import { TableSeleccionarPlantelComponent } from 'src/app/components/table-seleccionar-plantel/table-seleccionar-plantel.component';
import { CardCrearestadisticaComponent } from 'src/app/components/card-crearestadistica/card-crearestadistica.component';
import { TableJugadoresEstadisticaComponent } from 'src/app/components/table-jugadores-estadistica/table-jugadores-estadistica.component';
import { TablaTiroEstadisticaComponent } from 'src/app/components/tabla-tiro-estadistica/tabla-tiro-estadistica.component';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,
    BannerEstadisticaComponent,
    TableSeleccionarPlantelComponent,
    CardCrearestadisticaComponent,
    TableJugadoresEstadisticaComponent,
    TablaTiroEstadisticaComponent,
  ]
})

export class EstadisticaPage implements OnInit {

  partido: PartidoModel | null = null;
  activeTab: string = "Plantel";
  tabs = ['Plantel', 'Estadistica'];
  cuarto: string = '1C';
  agregarEst: boolean = false
  jugadorEstadistica: TeamMember | undefined
  private idPartidoAnterior: number | null = null;

  entrenadores: TeamMember[] = [];
  jugadores: TeamMember[] = [];
  resolveLanzamiento: ((value: { x: number, y: number, encestado: boolean } | null) => void) | null = null;
  tiempo = 0; // tiempo en segundos
  intervalo: any;
  cronometroActivo = false;
  coordenadas = false;

  faltasTotales: any[] = []
  asistenciasTotales: any[] = []
  bloqueosTotales: any[] = []
  robosTotales: any[] = []
  lanzamientosTotales: any[] = []
  rebotesTotales: any[] = []



  constructor(
    private location: Location,
    private router: Router,
    private partidoService: PartidoService,
  ) { }

  ngDoCheck() {
    if (this.partido && this.partido.id_partido !== this.idPartidoAnterior) {
      this.idPartidoAnterior = this.partido.id_partido;
      this.reiniciarEstadistica();
      console.log('Cambio de partido detectado con DoCheck');
    }
  }

  ngOnInit() {
    const navigation = history.state;

    if (navigation && navigation.partido) {
      const nuevoPartido = navigation.partido as PartidoModel;

      // Si cambia el partido (o si es la primera vez), reinicia
      if (!this.partido || this.partido.id_partido !== nuevoPartido.id_partido) {
        this.partido = nuevoPartido;
        this.reiniciarEstadistica();
        console.log('Partido actualizado y estadísticas reiniciadas:', this.partido);
      }
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
    this.entrenadores = lista;
    // Aquí puedes guardarlo, validarlo, etc.
  }

  actualizarJugadores(lista: TeamMember[]) {
    this.jugadores = lista;
  }

  estadisticaJugador(jugador: TeamMember) {
    this.agregarEst = true;
    this.jugadorEstadistica = jugador;
  }

  cerrarEstadistica() {
    this.agregarEst = false
  }

  reiniciarEstadistica() {
    this.faltasTotales = [];
    this.asistenciasTotales = [];
    this.bloqueosTotales = [];
    this.robosTotales = [];
    this.lanzamientosTotales = [];
    this.rebotesTotales = [];

    this.agregarEst = false;
    this.jugadorEstadistica = undefined;
    this.coordenadas = false;
    this.resolveLanzamiento = null;
    this.tiempo = 0;
    this.cronometroActivo = false;
    clearInterval(this.intervalo);
  }

  //LOGICA PARA LA ESTADISTICA

  getTiempoFormateado(): string {
    const minutos = Math.floor(this.tiempo / 60).toString().padStart(2, '0');
    const segundos = (this.tiempo % 60).toString().padStart(2, '0');
    return `${minutos}:${segundos}`;
  }

  iniciarCronometro() {
    if (!this.cronometroActivo) {
      this.cronometroActivo = true;
      this.intervalo = setInterval(() => {
        this.tiempo++;
      }, 1000);
    }
  }

  detenerCronometro() {
    clearInterval(this.intervalo);
    this.cronometroActivo = false;
  }

  reiniciarCronometro() {
    this.detenerCronometro();
    this.tiempo = 0;
  }

  convertirPeriodo(periodo: string): number {
    const p = periodo.toUpperCase();
    if (p === 'OT') return 5;
    if (p.endsWith('C')) return parseInt(p.charAt(0));
    return 0;
  }

  convertirRebote(tipo: string): number {
    const t = tipo.toLowerCase();
    if (t === 'ofensivo') return 1;
    if (t === 'defensivo') return 2;
    return 0; // por si viene vacío o inválido
  }

  convertirLanzamiento(tipo: string): number {
    const t = tipo.toLowerCase();
    if (t.includes('libre')) return 1;
    if (t.includes('campo') || t.includes('doble')) return 2;
    if (t.includes('triple')) return 3;
    return 0; // por si no coincide
  }


  //ARRAYS PARA SUBIR LA ESTADISTICA

  faltas() {
    const periodo = this.convertirPeriodo(this.cuarto)

    const falta = {
      "rut": this.jugadorEstadistica!.rut!,
      "id_periodo": periodo,
      "id_partido": this.partido!.id_partido
    }

    this.faltasTotales.push(falta);

    this.cerrarEstadistica()
    console.log(this.faltasTotales)
  }

  asistencias() {
    const periodo = this.convertirPeriodo(this.cuarto)

    const asistencia = {
      "rut": this.jugadorEstadistica!.rut!,
      "id_periodo": periodo,
      "id_partido": this.partido!.id_partido
    }

    this.asistenciasTotales.push(asistencia);

    this.cerrarEstadistica()
    console.log(this.asistenciasTotales)
  }

  bloqueos() {
    const periodo = this.convertirPeriodo(this.cuarto)

    const bloqueo = {
      "rut": this.jugadorEstadistica!.rut!,
      "id_periodo": periodo,
      "id_partido": this.partido!.id_partido
    }

    this.bloqueosTotales.push(bloqueo);

    this.cerrarEstadistica()
    console.log(this.bloqueosTotales)
  }


  robos() {
    const periodo = this.convertirPeriodo(this.cuarto)

    const robo = {
      "rut": this.jugadorEstadistica!.rut!,
      "id_periodo": periodo,
      "id_partido": this.partido!.id_partido
    }

    this.robosTotales.push(robo);

    this.cerrarEstadistica()
    console.log(this.robosTotales)
  }

  async lanzamientos(tipo: string) {
    const tipoTiro = this.convertirLanzamiento(tipo);
    const periodo = this.convertirPeriodo(this.cuarto);

    this.coordenadas = true; // muestra el modal hijo

    const resultado = await this.esperarLanzamiento();

    this.coordenadas = false; // oculta el modal

    if (!resultado) {
      console.log('Lanzamiento cancelado');
      return;
    }

    const lanzamiento = {
      rut: this.jugadorEstadistica!.rut!,
      id_periodo: periodo,
      id_partido: this.partido!.id_partido,
      id_tipo_tiro: tipoTiro,
      coordenada_x: resultado.x,
      coordenada_y: resultado.y,
      exito: resultado.encestado ? 1 : 0
    };

    this.lanzamientosTotales.push(lanzamiento);
    this.cerrarEstadistica();
    console.log(this.lanzamientosTotales);
  }

  rebotes(tipo: string) {
    const tipoRebote = this.convertirRebote(tipo);
    const periodo = this.convertirPeriodo(this.cuarto)

    const rebote = {
      "rut": this.jugadorEstadistica!.rut!,
      "id_periodo": periodo,
      "id_partido": this.partido!.id_partido,
      "id_tipo_rebote": tipoRebote,
    }

    this.rebotesTotales.push(rebote);

    this.cerrarEstadistica()
    console.log(this.rebotesTotales)
  }

  lanzarConfirmado(evento: { x: number, y: number, encestado: boolean }) {
    if (this.resolveLanzamiento) {
      this.resolveLanzamiento(evento);
      this.resolveLanzamiento = null;
    }
  }

  cancelarLanzamiento() {
    if (this.resolveLanzamiento) {
      this.resolveLanzamiento(null);
      this.resolveLanzamiento = null;
    }
  }

  esperarLanzamiento(): Promise<{ x: number, y: number, encestado: boolean } | null> {
    return new Promise(resolve => {
      this.resolveLanzamiento = resolve;
    });
  }

  async guardar() {
    this.partido!.estadisticas.asistencias = this.asistenciasTotales;
    this.partido!.estadisticas.bloqueos = this.bloqueosTotales;
    this.partido!.estadisticas.faltas = this.faltasTotales;
    this.partido!.estadisticas.lanzamientos = this.lanzamientosTotales;
    this.partido!.estadisticas.rebotes.defensivos = this.rebotesTotales.filter(r => r.id_tipo_rebote === 2);
    this.partido!.estadisticas.rebotes.ofensivos = this.rebotesTotales.filter(r => r.id_tipo_rebote === 1);
    this.partido!.estadisticas.robos = this.robosTotales;

    console.log('Partido a guardar:', this.partido);
  }

}
