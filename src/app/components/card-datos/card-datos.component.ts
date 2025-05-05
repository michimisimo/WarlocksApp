import { Component, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CurrentUser } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-card-datos',
  templateUrl: './card-datos.component.html',
  styleUrls: ['./card-datos.component.scss'],
  standalone: true,
  imports: [CommonModule,IonicModule],
})


export class CardDatosComponent  implements OnInit {

  @Input() usuario!: CurrentUser;

  constructor( ) { }

  ngOnInit() {
  }

}
