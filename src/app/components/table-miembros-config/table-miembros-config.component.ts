import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonRow, IonCol, IonGrid, IonCardTitle } from '@ionic/angular/standalone';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-table-miembros-config',
  templateUrl: './table-miembros-config.component.html',
  styleUrls: ['./table-miembros-config.component.scss'],
  imports: [CommonModule, IonButton, IonCard, IonCardContent, IonCardHeader, IonRow, IonCol, IonGrid, IonCardTitle]
})
export class TableMiembrosConfigComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Input() usuarios: TeamMember[] = [];
  @Input() rol: string = '';
  mostrarTodos = false;

  toggleVerMas() {
    this.mostrarTodos = !this.mostrarTodos;
  }

  editar(entrenador: any) {
    console.log('Editar', entrenador);
  }

  eliminar(entrenador: any) {
    console.log('Eliminar', entrenador);
  }

  usuariosSlice(): TeamMember[] {
    return this.mostrarTodos ? this.usuarios : this.usuarios.slice(0, 3);
  }

}
