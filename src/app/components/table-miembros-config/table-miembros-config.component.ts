import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonRow, IonCol, IonGrid, IonCardTitle } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';

import { Role, TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { CardCrearuserComponent } from '../card-crearuser/card-crearuser.component';
import { MiembrosService } from 'src/app/services/miembros/miembros.service';
import { CardEditaruserComponent } from '../card-editaruser/card-editaruser.component';

@Component({
  selector: 'app-table-miembros-config',
  templateUrl: './table-miembros-config.component.html',
  styleUrls: ['./table-miembros-config.component.scss'],
  imports: [CommonModule, IonButton, IonCard, IonCardContent, IonCardHeader,
    IonRow, IonCol, IonGrid, IonCardTitle, CardCrearuserComponent, CardEditaruserComponent]
})
export class TableMiembrosConfigComponent implements OnInit {

  constructor(
    private miembrosSvc: MiembrosService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  @Input() usuarios: TeamMember[] = [];
  @Input() rol: Role = 'jugador';
  mostrarTodos = false;
  crear = false;
  editarSeleccionado: TeamMember | null = null;

  toggleVerMas() {
    this.mostrarTodos = !this.mostrarTodos;
  }


  async eliminar(usuario: TeamMember) {
    const alert = await this.alertCtrl.create({
      header: 'confirmar eliminacion',
      message: '¿Seguro que quieres borrar a ' + usuario.pnombre + ' ' + usuario.appaterno + '?',
      buttons: [
        { text: 'cancelar', role: 'cancel' },
        {
          text: 'Borrar',
          handler: async () => {
            //eliminar storage
            await this.miembrosSvc.removeMember(usuario.rut);
            //refresca el listado 
            this.usuarios = this.usuarios.filter(u => u.rut !== usuario.rut);
          }
        }
      ]
    });
    await alert.present();
  }

  usuariosSlice(): TeamMember[] {
    return this.mostrarTodos ? this.usuarios : this.usuarios.slice(0, 3);
  }

  handleCreate(nuevo: TeamMember) {
    console.log('Usuario creado:', nuevo);
    this.miembrosSvc.saveMember(nuevo)
    this.crear = false;
  }

  editar(usuario: TeamMember) {
    this.editarSeleccionado = usuario;
  }

  // Cuando se recibe el submit del editar
  handleEdit(actualizado: TeamMember) {
    const idx = this.usuarios.findIndex(u => u.rut === actualizado.rut);
    if (idx > -1) this.usuarios[idx] = actualizado;
    this.editarSeleccionado = null;
  }

}
