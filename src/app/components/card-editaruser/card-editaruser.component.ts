import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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

  // Capitalización automática
  capitalize(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';
  }

  // Guardar cambios y emitir evento
  async guardarCambios(form: NgForm) {
    if (form.valid) {
      // Capitalización de campos
      this.usuario.pnombre = this.capitalize(this.usuario.pnombre!);
      this.usuario.snombre = this.capitalize(this.usuario.snombre!);
      this.usuario.appaterno = this.capitalize(this.usuario.appaterno!);
      this.usuario.apmaterno = this.capitalize(this.usuario.apmaterno!);

      await this.miembrosService.saveMember(this.usuario);
      this.submit.emit(this.usuario); // Emitimos el evento de actualización
      this.modalCtrl.dismiss(this.usuario); // Cerramos el modal
    }
  }

  // Cancelar operación
  onCancel() {
    this.cancel.emit();
    this.modalCtrl.dismiss(); // Cerramos el modal sin cambios
  }
}
