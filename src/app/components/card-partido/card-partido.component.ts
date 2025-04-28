import { Component, Input, OnInit } from '@angular/core';
import { IonChip, IonCard, IonCardContent, IonCardHeader } from '@ionic/angular/standalone';
@Component({
  selector: 'app-card-partido',
  templateUrl: './card-partido.component.html',
  styleUrls: ['./card-partido.component.scss'],
  imports: [IonChip, IonCard, IonCardContent, IonCardHeader],
})
export class CardPartidoComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Input() fecha: string = '';
  @Input() nombreLiga: string = '';
  @Input() equipoLocal: string = '';
  @Input() hora: string = '';
  @Input() equipoVisitante: string = '';

}
