import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Role, TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { MiembrosService } from 'src/app/services/miembros/miembros.service';

@Component({
  selector: 'app-card-editaruser',
  standalone: true,
  templateUrl: './card-editaruser.component.html',
  styleUrls: ['./card-editaruser.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CardEditaruserComponent implements OnInit {

  @Input() usuario!: TeamMember;
  @Input() rol!: Role;
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<TeamMember>();

  constructor(
    private modalCtrl: ModalController,
    private miembrosService: MiembrosService
  ) { }

  ngOnInit(): void {
    this.usuario = { ...this.usuario };
  }

  async guardarCambios() {
    await this.miembrosService.saveMember(this.usuario);
    this.modalCtrl.dismiss(this.usuario);
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    this.submit.emit(this.usuario);
  }

}
