import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Role, TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-card-crearuser',
  standalone: true,
  templateUrl: './card-crearuser.component.html',
  styleUrls: ['./card-crearuser.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CardCrearuserComponent implements OnInit {

  @Input() rol!: Role;
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<TeamMember>();

  usuario: TeamMember = {
    pnombre: '',
    snombre: '',
    appaterno: '',
    apmaterno: '',
    rut: '',
    dv_rut: '',
    posicion: '',
    categoria: '',
    rol: this.rol
  };

  constructor() { }

  ngOnInit(): void {
    this.usuario.rol = this.rol;

    if (this.rol !== 'jugador') {
      this.usuario.categoria = 'ALL';
      this.usuario.posicion = 'ALL';
    }
  }

  cerrar() {
    this.cancel.emit();
  }

  capitalize(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  guardar(form: NgForm) {
    if (form.valid) {
      // Capitalizamos los campos necesarios
      this.usuario.pnombre = this.capitalize(this.usuario.pnombre!);
      this.usuario.snombre = this.capitalize(this.usuario.snombre!);
      this.usuario.appaterno = this.capitalize(this.usuario.appaterno!);
      this.usuario.apmaterno = this.capitalize(this.usuario.apmaterno!);

      this.submit.emit(this.usuario);
      form.resetForm();
      this.cerrar();
    }
  }
}
