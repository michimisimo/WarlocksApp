import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-card-crearpartido',
  templateUrl: './card-crearpartido.component.html',
  styleUrls: ['./card-crearpartido.component.scss'],
  imports: [FormsModule, IonicModule]
})
export class CardCrearpartidoComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Output() guardado = new EventEmitter<any>();
  @Output() cancelado = new EventEmitter<void>();

  partido = {
    contrincante: '',
    fecha: '',
    hora: '',
    local: '',
    categoria: ''
  };

  guardarPartido() {
    console.log('Guardando partido:', this.partido);
    this.guardado.emit(this.partido);
  }

  cancelar() {
    this.cancelado.emit();
  }

}
