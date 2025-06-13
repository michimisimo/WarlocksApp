import { Component, OnInit, Input } from '@angular/core';
import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';

@Component({
  selector: 'app-marcador',
  templateUrl: './marcador.component.html',
  styleUrls: ['./marcador.component.scss'],
})
export class MarcadorComponent implements OnInit {

  @Input() partido: PartidoModel | undefined

  C1: number = 0;
  C2: number = 0;
  C3: number = 0;
  C4: number = 0
  OT: number = 0;
  total: number = 0;

  constructor() { }

  ngOnInit() {
    this.C1 = this.partido?.estadisticas.lanzamientos
      .filter(l => l.nombre_periodo === "1C")
      .filter(l => l.exito === 1)
      .reduce((sum, l) => sum + (l.punto || 0), 0);

    this.C2 = this.partido?.estadisticas.lanzamientos
      .filter(l => l.nombre_periodo === "2C")
      .filter(l => l.exito === 1)
      .reduce((sum, l) => sum + (l.punto || 0), 0);

    this.C3 = this.partido?.estadisticas.lanzamientos
      .filter(l => l.nombre_periodo === "3C")
      .filter(l => l.exito === 1)
      .reduce((sum, l) => sum + (l.punto || 0), 0);

    this.C4 = this.partido?.estadisticas.lanzamientos
      .filter(l => l.nombre_periodo === "4C")
      .filter(l => l.exito === 1)
      .reduce((sum, l) => sum + (l.punto || 0), 0);

    this.OT = this.partido?.estadisticas.lanzamientos
      .filter(l => l.nombre_periodo === "OT")
      .filter(l => l.exito === 1)
      .reduce((sum, l) => sum + (l.punto || 0), 0);

    this.total = this.C1 + this.C2 + this.C3 + this.C4 + this.OT
  }

}
