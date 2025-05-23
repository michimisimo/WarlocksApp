import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-est-partido',
  templateUrl: './est-partido.component.html',
  styleUrls: ['./est-partido.component.scss'],
  imports: [CommonModule],
})
export class EstPartidoComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Input() estadisticas: { nombre: string; valor: string | number }[] = [];

}
