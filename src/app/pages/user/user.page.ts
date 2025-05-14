import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerTopComponent } from 'src/app/components/banner-top/banner-top.component';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';
import { TableMiembrosConfigComponent } from 'src/app/components/table-miembros-config/table-miembros-config.component';
import { MiembrosService } from 'src/app/services/miembros/miembros.service';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { CurrentUser } from 'src/app/services/mappers/map-user/map-user.service';
import { CardDatosComponent } from 'src/app/components/card-datos/card-datos.component';
import { CardCampassComponent } from 'src/app/components/card-campass/card-campass.component';
import { CardCrearuserComponent } from 'src/app/components/card-crearuser/card-crearuser.component';
import { CardEditaruserComponent } from 'src/app/components/card-editaruser/card-editaruser.component';
import { Role } from 'src/app/services/mappers/map-user/map-user.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BannerTopComponent, IonicModule, TableMiembrosConfigComponent, CardDatosComponent, CardCampassComponent, CardCrearuserComponent, CardEditaruserComponent]
})
export class UserPage implements OnInit, AfterViewInit {

  @ViewChild(BannerTopComponent) componente!: BannerTopComponent;

  tabs = ['Mi cuenta', 'Usuarios'];
  activeTab = 'Mi Cuenta';
  usuario: CurrentUser | null = null;
  usuarioSeleccionado: TeamMember | undefined;


  modalAbiertoEditar = false;
  modalAbiertoCrear: boolean = false;
  rolSeleccionado: Role | undefined;

  entrenadores: TeamMember[] = []
  estadisticos: TeamMember[] = []
  jugadores: TeamMember[] = []

  entrenadoresFiltrados: TeamMember[] = []
  estadisticosFiltrados: TeamMember[] = []
  jugadoresFiltrados: TeamMember[] = []

  constructor(
    private router: Router,
    private userService: UserService,
    private miembroService: MiembrosService,
  ) { }

  async ngOnInit() {
    this.activeTab = 'Mi cuenta';
    this.showCategoria();
    await this.getUsuarios();
    await this.cargarDatosUser();

    const CurrentUser = await this.userService.getCurrentUser();
    if (CurrentUser!.rol != 'entrenador') {
      this.tabs = ['', '']
    }
    this.filtrarMiembrosPorCategoria('U11');
  }

  ngAfterViewInit() {
    this.showCategoria();
  }

  async cargarDatosUser() {
    this.usuario = await this.userService.getCurrentUser();
    console.log(this.usuario)
  }

  showCategoria() {
    // Si estamos en 'Mi cuenta', ocultamos las categorías
    if (this.componente) {
      this.componente.showCat3 = this.activeTab === 'Usuarios';
    }
  }

  cambiarTab(tab: string) {
    this.activeTab = tab;
    this.showCategoria();
  }

  async getUsuarios() {
    const usuariosObj = await this.miembroService.getAllMembers();
    const usuariosArray = Object.values(usuariosObj); // convierte el objeto a array

    this.entrenadores = usuariosArray.filter(u => u.rol === 'entrenador');
    this.jugadores = usuariosArray.filter(u => u.rol === 'jugador');
    this.estadisticos = usuariosArray.filter(u => u.rol === 'estadistico');
  }

  filtrarMiembrosPorCategoria(categoria: string) {
    this.entrenadoresFiltrados = this.entrenadores.filter(
      e => e.categoria === categoria || 'ALL');

    this.estadisticosFiltrados = this.estadisticos.filter(
      e => e.categoria === categoria || 'ALL');

    this.jugadoresFiltrados = this.jugadores.filter(
      j => j.categoria === categoria);
  }

  volverAInicio() {
    this.router.navigate(['/inicio'])
  }

  cerrarSesion() {
    this.userService.removeCurrentUser();
    this.router.navigate(['/home'])
  }

  abrirModalCrear(rol: Role) {
    this.rolSeleccionado = rol;
    this.modalAbiertoCrear = true;
  }

  cerrarModalCrear() {
    this.modalAbiertoCrear = false;
  }

  abrirModalEditar(usuario: TeamMember, rol: Role) {
    this.usuarioSeleccionado = usuario;
    this.rolSeleccionado = rol;
    this.modalAbiertoEditar = true;
  }

  cerrarModalEditar() {
    this.modalAbiertoEditar = false;
    this.usuarioSeleccionado = undefined;
    this.rolSeleccionado = undefined;
  }

  agregarUsuario(usuario: TeamMember) {

    this.cerrarModalCrear();
  }

  editarUsuario(usuario: TeamMember) {
    console.log('Editar usuario:', usuario);
    // Lógica de edición aquí
  }

  eliminarUsuario(usuario: TeamMember) {
    console.log('Eliminar usuario:', usuario);
    if (usuario.rol === 'entrenador') {
      this.entrenadoresFiltrados = this.entrenadoresFiltrados.filter(u => u !== usuario);
    } else if (usuario.rol === 'estadistico') {
      this.estadisticosFiltrados = this.estadisticosFiltrados.filter(u => u !== usuario);
    } else if (usuario.rol === 'jugador') {
      this.jugadoresFiltrados = this.jugadoresFiltrados.filter(u => u !== usuario);
    }
  }

  actualizarUsuario(usuarioActualizado: TeamMember) {
    console.log('Usuario actualizado:', usuarioActualizado);
    this.cerrarModalEditar();
  }
}

