import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-campass',
  standalone: true,
  templateUrl: './card-campass.component.html',
  styleUrls: ['./card-campass.component.scss'],
  imports: [CommonModule,IonicModule,FormsModule]
})
export class CardCampassComponent  implements OnInit {

  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  constructor() { }

  ngOnInit() {}

}
