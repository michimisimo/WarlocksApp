import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role, TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-card-crearuser',
  standalone: true,
  templateUrl: './card-crearuser.component.html',
  styleUrls: ['./card-crearuser.component.scss'],
  imports: [IonicModule,CommonModule, FormsModule]
})
export class CardCrearuserComponent  implements OnInit {

  @Input() rol!: Role;
  usuario!: TeamMember;

  /*usuario: TeamMember = {
    pnombre: '',
    snombre: '',
    appaterno: '',
    apmaterno: '',
    rut: '',
    posicion: '',
    categoria: ''
  };*/

  constructor(
    private modalCtrl : ModalController
  ) { }

  ngOnInit():void {
    this.usuario = {
    pnombre: '',
    snombre: '',
    appaterno: '',
    apmaterno: '',
    rut: '',
    posicion: '',
    categoria: '',
    rol: this.rol     
    }
  }


  cerrar(){
    this.modalCtrl.dismiss();
  }

  guardar(): void{
    console.log('Crear:',this.usuario);
    this.modalCtrl.dismiss(this.usuario);
  }

}
