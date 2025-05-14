import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-miembros-config',
  standalone: true,
  templateUrl: './table-miembros-config.component.html',
  styleUrls: ['./table-miembros-config.component.scss'],
  imports: [IonicModule, CommonModule] // Solo esto es necesario
})
export class TableMiembrosConfigComponent {

  @Input() usuarios: TeamMember[] = [];
  @Input() rol: string = 'jugador';
  @Output() crear = new EventEmitter<void>();
  @Output() editar = new EventEmitter<TeamMember>();
  @Output() eliminar = new EventEmitter<TeamMember>();

  mostrarTodos = false;

  toggleVerMas() {
    this.mostrarTodos = !this.mostrarTodos;
  }

  usuariosSlice(): TeamMember[] {
    return this.mostrarTodos ? this.usuarios : this.usuarios.slice(0, 3);
  }

  onCrear() {
    this.crear.emit();
  }

  onEditar(usuario: TeamMember) {
    this.editar.emit(usuario);
  }

  onEliminar(usuario: TeamMember) {
    this.eliminar.emit(usuario);
  }
}
