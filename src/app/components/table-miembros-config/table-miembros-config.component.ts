import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonRow, IonCol, IonGrid, IonCardTitle } from '@ionic/angular/standalone';
import { ModalController, AlertController } from '@ionic/angular';

import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { CardCrearuserComponent } from '../card-crearuser/card-crearuser.component';
import { MiembrosService } from 'src/app/services/miembros/miembros.service';
import { CardEditaruserComponent } from '../card-editaruser/card-editaruser.component';

@Component({
  selector: 'app-table-miembros-config',
  templateUrl: './table-miembros-config.component.html',
  styleUrls: ['./table-miembros-config.component.scss'],
  imports: [CommonModule, IonButton, IonCard, IonCardContent, IonCardHeader, IonRow, IonCol, IonGrid, IonCardTitle]
})
export class TableMiembrosConfigComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private miembrosSvc: MiembrosService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  @Input() usuarios: TeamMember[] = [];
  @Input() rol: string = '';
  mostrarTodos = false;

  toggleVerMas() {
    this.mostrarTodos = !this.mostrarTodos;
  }

  async editar(usuario: TeamMember){
    const modal = await this.modalCtrl.create({
    component: CardEditaruserComponent,
    componentProps: {usuario}  
    });

    modal.onDidDismiss().then(res =>{
      if (res.data){
        const index = this.usuarios.findIndex(u => u.rut === res.data.rut);
        if (index >-1){
          this.usuarios[index] = res.data;
        }
      }
    });
    return await modal.present();
  }

  async eliminar(usuario: TeamMember) {
    const alert = await this.alertCtrl.create({
      header: 'confirmar eliminacion',
      message:'¿Seguro que quieres borrar a ' + usuario.pnombre + ' ' + usuario.appaterno + '?',
      buttons: [
        {text: 'cancelar', role: 'cancel'},
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

  //posible
  async abrirCrear(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CardCrearuserComponent,
      componentProps: { rol: this.rol },
    });

    await modal.present();
    
    const { data } = await modal.onDidDismiss<TeamMember>();
    if (data){
      await this.miembrosSvc.saveMember(data);
      this.usuarios= [...this.usuarios, data];  
    }
  }

}
