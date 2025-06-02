import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-resumen-estadistica',
  templateUrl: './resumen-estadistica.component.html',
  styleUrls: ['./resumen-estadistica.component.scss'],
})
export class ResumenEstadisticaComponent implements OnInit {

  @Output() verMasClicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  emitirVerMas() {
    this.verMasClicked.emit();
  }

}
