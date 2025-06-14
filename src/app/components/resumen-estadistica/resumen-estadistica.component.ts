import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';

@Component({
  selector: 'app-resumen-estadistica',
  templateUrl: './resumen-estadistica.component.html',
  styleUrls: ['./resumen-estadistica.component.scss'],
})
export class ResumenEstadisticaComponent implements OnInit {

  @Input() partido: PartidoModel | undefined
  @Output() verMasClicked = new EventEmitter<void>();

  tiroCampo: string = ""
  tiroLibre: string = ""
  triple: string = ""

  constructor() { }

  ngOnInit() {
    this.calcularTotales()
  }

  emitirVerMas() {
    this.verMasClicked.emit();
  }

  calcularTotales() {
    // Totales para tiros
    const tirosCampoTotal = this.partido!.estadisticas.lanzamientos.filter(l => l.nombre_tiro === "doble");
    const tirosCampoEncestados = tirosCampoTotal.filter(l => l.exito === 1);

    const triplesTotal = this.partido!.estadisticas.lanzamientos.filter(l => l.nombre_tiro === "triple");
    const triplesEncestados = triplesTotal.filter(l => l.exito === 1);

    const libresTotal = this.partido!.estadisticas.lanzamientos.filter(l => l.nombre_tiro === "libre");
    const libresEncestados = libresTotal.filter(l => l.exito === 1);

    // Formatear %
    function porcentaje(encestados: number, intentos: number): string {
      return intentos === 0 ? '0%' : ((encestados / intentos) * 100).toFixed(1) + '%';
    }

    this.tiroCampo = `${tirosCampoEncestados.length}/${tirosCampoTotal.length} (${porcentaje(tirosCampoEncestados.length, tirosCampoTotal.length)})`;
    this.triple = `${triplesEncestados.length}/${triplesTotal.length} (${porcentaje(triplesEncestados.length, triplesTotal.length)})`;
    this.tiroLibre = `${libresEncestados.length}/${libresTotal.length} (${porcentaje(libresEncestados.length, libresTotal.length)})`;
  }

}
