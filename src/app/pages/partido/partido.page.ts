import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, } from '@ionic/angular/standalone';

import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';
import { BannerPartidoComponent } from 'src/app/components/banner-partido/banner-partido.component';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,
    BannerPartidoComponent,
  ]
})
export class PartidoPage implements OnInit {

  partido: PartidoModel | undefined;

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
    const navigation = history.state;
    if (navigation && navigation.partido) {
      this.partido = navigation.partido;
      console.log(this.partido)
    }
  }

}
