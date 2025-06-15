import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonChip, IonCard, IonCardContent, IonCardHeader } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CurrentUser } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-card-partido',
  templateUrl: './card-partido.component.html',
  styleUrls: ['./card-partido.component.scss'],
  imports: [IonChip, IonCard, IonCardContent, IonCardHeader, CommonModule],
})
export class CardPartidoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log(this.usuario)
  }

  @Input() fecha: string = '';
  @Input() nombreLiga: string = '';
  @Input() equipoLocal: string = '';
  @Input() hora: string = '';
  @Input() equipoVisitante: string = '';
  @Input() usuario: CurrentUser | null = null


  @Output() verPartido = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();


  verPartido_() {
    this.verPartido.emit();
  }

  editar_() {
    this.editar.emit();
  }

}
