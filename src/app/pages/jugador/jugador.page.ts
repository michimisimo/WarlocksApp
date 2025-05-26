import { Component, OnInit } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

import { BannerJugadorComponent } from 'src/app/components/banner-jugador/banner-jugador.component';
import { UltimosPartidosComponent } from 'src/app/components/ultimos-partidos/ultimos-partidos.component';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.page.html',
  styleUrls: ['./jugador.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterModule,
    BannerJugadorComponent,
    UltimosPartidosComponent
  ]
})
export class JugadorPage implements OnInit {

  jugador: TeamMember | undefined

  constructor(private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const navigation = history.state;
    if (navigation && navigation.jugador) {
      this.jugador = navigation.jugador;
      console.log(this.jugador)
    }
  }
}
