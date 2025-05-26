import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';

@Component({
  selector: 'app-ultimos-partidos',
  templateUrl: './ultimos-partidos.component.html',
  styleUrls: ['./ultimos-partidos.component.scss'],
  imports: [CommonModule,]
})
export class UltimosPartidosComponent implements OnInit {

  @Input() partidos: PartidoModel[] = [];
  jugadores = undefined

  constructor() { }

  ngOnInit() { }

}
