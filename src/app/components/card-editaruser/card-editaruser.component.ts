import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { MiembrosService } from 'src/app/services/miembros/miembros.service';

@Component({
  selector: 'app-card-editaruser',
  standalone: true,
  templateUrl: './card-editaruser.component.html',
  styleUrls: ['./card-editaruser.component.scss'],
  imports: [CommonModule,IonicModule,FormsModule]
})
export class CardEditaruserComponent  implements OnInit {

  @Input() usuario!: TeamMember;

  constructor(
    private modalCtrl: ModalController,
    private miembrosService: MiembrosService
  ) { }

  ngOnInit() {}

  async guardarCambios( ){
    await this.miembrosService.saveMember(this.usuario);
    this.modalCtrl.dismiss(this.usuario);
  }

  cancelar(){
    this.modalCtrl.dismiss(null);
  }

}
