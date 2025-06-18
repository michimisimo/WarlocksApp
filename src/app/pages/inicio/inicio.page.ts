import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { SyncPartidoService } from 'src/app/services/sincronizar/sincronizar-partido/sincronizar-partido.service';
import { PartidoService } from 'src/app/services/partido/partido.service';
import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';
import { UserService } from 'src/app/services/user/user.service';
import { SincronizarMiembrosService } from 'src/app/services/sincronizar/sincronizar-miembros/sincronizar-miembros.service';
import { MiembrosService } from 'src/app/services/miembros/miembros.service';
import { CurrentUser, TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { StatEntry } from 'src/app/components/est-temporada/est-temporada.component';

import { CardPartidoComponent } from 'src/app/components/card-partido/card-partido.component';
import { BannerTopComponent } from 'src/app/components/banner-top/banner-top.component';
import { PlantelTablaComponent } from 'src/app/components/plantel-tabla/plantel-tabla.component';
import { EstTemporadaComponent } from 'src/app/components/est-temporada/est-temporada.component';
import { CardCrearpartidoComponent } from 'src/app/components/card-crearpartido/card-crearpartido.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    BannerTopComponent,
    CardPartidoComponent,
    PlantelTablaComponent,
    EstTemporadaComponent,
    CardCrearpartidoComponent,
    IonContent,
    CommonModule,
    FormsModule,
    IonSpinner,
  ]
})
export class InicioPage implements OnInit, AfterViewInit {

  @ViewChild(BannerTopComponent) componente!: BannerTopComponent;

  activeTab = 'Temporada';
  tabs = ['Temporada', 'Plantel'];

  activeOTab = 'Partidos';
  oTabs = ['Partidos', 'Estadisticas'];

  partidos: PartidoModel[] = [];
  partidosFiltrados: PartidoModel[] = [];
  categoriaActiva: string = 'U11';
  user: CurrentUser | null = null

  isLoading: boolean = false;
  crear: boolean = false;

  constructor(
    private syncService: SyncPartidoService,
    private partidoService: PartidoService,
    private userService: UserService,
    private router: Router,
    private syncMiembros: SincronizarMiembrosService,
    private miembrosService: MiembrosService

  ) { }

  async ngOnInit() {
    try {
      this.isLoading = true;

      await this.syncService.sincronizarTodos();

      const dict = await this.partidoService.obtenerTodosLosPartidos();
      this.partidos = Object.values(dict);
      this.user = await this.userService.getCurrentUser()
      console.log(this.user)
      await this.syncMiembros.sincronizarTodos();
    } catch (err) {
      console.error('Error cargando partidos:', err);
    } finally {
      this.isLoading = false;
      const miembrosMap = await this.miembrosService.getAllMembers();
      // Convierte el diccionario en array:
      this.jugadores = Object.values(miembrosMap);
      this.partidosFiltrados = [...this.partidos];
      this.filtrarPartidosPorCategoria('U11');
    }
  };

  ngAfterViewInit() {
    this.componente.desactivarBack();
  }

  // Este método se llama desde el template cuando BannerTop emite (categorySelected)
  filtrarPartidosPorCategoria(categoria: string) {
    if (categoria === 'Todas') {
      this.partidosFiltrados = [...this.partidos];
    } else {
      this.categoriaActiva = categoria;
      console.log(this.categoriaActiva)
      const catNum = this.getCategoriaNum(categoria);
      this.partidosFiltrados = this.partidos.filter(
        p => p.info_global.id_categoria === catNum
      );
    }
  }

  private getCategoriaNum(categoria: string): number {
    switch (categoria) {
      case 'U11': return 1;
      case 'U13': return 2;
      case 'U15': return 3;
      case 'U18': return 4;
      default: return 0;
    }
  }
  // funcion de navegacion
  irACuenta() {
    this.router.navigate(['/user']);
  }

  verPartido(partido: PartidoModel) {
    this.router.navigate(['/partido'], { state: { partido: partido } });
  }

  editarPartido(partido: PartidoModel) {
    console.log(partido)
    this.router.navigate(['/estadistica'], { state: { partido: partido } });
  }

  jugadores: TeamMember[] = [];

  onPlayerSelected(jugador: any) {
    this.router.navigate(['/jugador'], { state: { jugador: jugador } });
  }

  onCrear() {
    console.log('btn presionado')
    document.querySelector('ion-content')?.classList.add('scroll-bloqueado');
    this.crear = true;
  }

  obtenerIdCategoria(nombre: string): number | null {
    const categorias: Record<string, number> = {
      'U11': 1,
      'U13': 2,
      'U15': 3,
      'U18': 4,
      'ALL': 5
    };

    return categorias[nombre] ?? null;
  }

  obtenerValorLocalidad(tipo: string): number | null {
    const localidades: Record<string, number> = {
      'local': 1,
      'visitante': 0
    };

    return localidades[tipo.toLowerCase()] ?? null;
  }

  async onPartidoGuardado(partido: any) {

    partido.categoria = this.obtenerIdCategoria(partido.categoria)
    partido.local = this.obtenerValorLocalidad(partido.local)

    console.log('Partido recibido desde el hijo:', partido);

    await this.syncService.subirpartido(partido)
    await this.syncService.sincronizarTodos();

    const dict = await this.partidoService.obtenerTodosLosPartidos();
    this.partidos = Object.values(dict);
    this.crear = false;
  }

  onCancelarCrearPartido() {
    console.log('Formulario cancelado');
    this.crear = false; // Ocultar el formulario
  }

  stats: {
    puntos: StatEntry[];
    asistencias: StatEntry[];
    rebotes: StatEntry[];
    robos: StatEntry[];
  } = {
      puntos: [
        { name: 'Nombre Jugador 1', value: 25.7 },
        { name: 'Nombre Jugador 2', value: 12.9 },
        { name: 'Nombre Jugador 3', value: 12.4 },
        { name: 'Nombre Jugador 4', value: 9.1 },
        { name: 'Nombre Jugador 5', value: 8.3 },
      ],
      asistencias: [
        { name: 'Nombre Jugador 1', value: 4.7 },
        { name: 'Nombre Jugador 2', value: 3.4 },
        { name: 'Nombre Jugador 3', value: 1.4 },
        { name: 'Nombre Jugador 4', value: 1.1 },
      ],
      rebotes: [
        { name: 'Nombre Jugador 1', value: 11.9 },
        { name: 'Nombre Jugador 2', value: 5.0 },
        { name: 'Nombre Jugador 3', value: 4.7 },
        { name: 'Nombre Jugador 4', value: 3.8 },
      ],
      robos: [
        { name: 'Nombre Jugador 1', value: 1.3 },
        { name: 'Nombre Jugador 2', value: 1.0 },
        { name: 'Nombre Jugador 3', value: 0.8 },
        { name: 'Nombre Jugador 4', value: 0.6 },
      ],
    };
}
