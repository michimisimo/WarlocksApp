import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  standalone: true,
  selector: 'app-card-crearestadistica',
  templateUrl: './card-crearestadistica.component.html',
  styleUrls: ['./card-crearestadistica.component.scss'],
  imports: [IonicModule, FormsModule]
})
export class CardCrearestadisticaComponent implements OnInit {

  @Input() jugador: TeamMember | undefined
  reboteSeleccionado: string = '';
  lanzamientoSeleccionado: string = '';

  @Output() enviarAsistencia = new EventEmitter<any>();
  @Output() enviarFaltas = new EventEmitter<any>();
  @Output() enviarBloqueos = new EventEmitter<any>();
  @Output() enviarRobos = new EventEmitter<any>();
  @Output() enviarLanzamiento = new EventEmitter<string>();
  @Output() enviarRebote = new EventEmitter<string>();
  @Output() cerrar = new EventEmitter<any>();


  constructor() { }

  ngOnInit() { }

  asistencias() {
    this.enviarAsistencia.emit();
  }

  faltas() {
    this.enviarFaltas.emit();
  }

  bloqueos() {
    this.enviarBloqueos.emit();
  }

  robos() {
    this.enviarRobos.emit();
  }

  lanzamiento(valor: string) {
    console.log(valor)
    this.enviarLanzamiento.emit(valor);
  }

  rebote(valor: string) {
    console.log(valor)
    this.enviarRebote.emit(valor);
  }

  cancelar() {
    console.log('cerrar modal')
    this.cerrar.emit();
  }

}
