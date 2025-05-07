import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, } from '@ionic/angular/standalone';

import { TablaTiroComponent } from 'src/app/components/tabla-tiro/tabla-tiro.component';

@Component({
  selector: 'app-component-test',
  templateUrl: './component-test.page.html',
  styleUrls: ['./component-test.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, TablaTiroComponent]
})

export class ComponentTestPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  listaTiros = [
    { x: 20, y: 10, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 20, y: 10, encestado: false, cuarto: '1C', jugador: 'Felipe' },
    { x: 55, y: 80, encestado: true, cuarto: '2C', jugador: 'Jean' },
    { x: 30, y: 15, encestado: false, cuarto: '1C', jugador: 'Felipe' },
    { x: 40, y: 25, encestado: true, cuarto: '2C', jugador: 'Jean' },
    { x: 60, y: 70, encestado: false, cuarto: '3C', jugador: 'Laura' },
    { x: 65, y: 75, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 70, y: 20, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 10, y: 90, encestado: true, cuarto: '2C', jugador: 'Felipe' },
    { x: 50, y: 50, encestado: true, cuarto: '1C', jugador: 'Jean' },
    { x: 25, y: 40, encestado: false, cuarto: '3C', jugador: 'Laura' },
    { x: 80, y: 60, encestado: true, cuarto: '4C', jugador: 'Carlos' },
    { x: 15, y: 35, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 45, y: 55, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 75, y: 65, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 35, y: 30, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 90, y: 10, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 12, y: 22, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 52, y: 72, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 62, y: 82, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 18, y: 48, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 28, y: 58, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 38, y: 68, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 48, y: 78, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 58, y: 88, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 68, y: 18, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 78, y: 28, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 88, y: 38, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 95, y: 48, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 20, y: 60, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 30, y: 70, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 40, y: 80, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 50, y: 90, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 60, y: 10, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 70, y: 20, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 80, y: 30, encestado: false, cuarto: '4C', jugador: 'Carlos' },
    { x: 90, y: 40, encestado: true, cuarto: '1C', jugador: 'Felipe' },
    { x: 25, y: 50, encestado: false, cuarto: '2C', jugador: 'Jean' },
    { x: 35, y: 60, encestado: true, cuarto: '3C', jugador: 'Laura' },
    { x: 45, y: 70, encestado: false, cuarto: '4C', jugador: 'Carlos' }
  ];

}
