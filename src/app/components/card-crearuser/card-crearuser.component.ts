import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role, TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-card-crearuser',
  standalone: true,
  templateUrl: './card-crearuser.component.html',
  styleUrls: ['./card-crearuser.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule,]
})
export class CardCrearuserComponent implements OnInit {

  @Input() rol!: Role;
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<TeamMember>();
  usuario!: TeamMember;

  constructor() { }

  ngOnInit(): void {
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

    if (this.rol != 'jugador') {
      this.usuario.categoria = 'ALL';
      this.usuario.posicion = 'ALL';

    }
  }

  cerrar() {
    this.cancel.emit();
  }

  guardar(): void {
    this.submit.emit(this.usuario);
    this.cerrar()
  }

}
