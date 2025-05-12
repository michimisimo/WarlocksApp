import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

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
  contrasenaActual: string='';

  constructor(
    private alertCtrl: AlertController,
    private userService: UserService
  ) { }

  ngOnInit() {}

  async mostrarAlertaExito() {
  const alerta = await this.alertCtrl.create({
    header: 'Éxito',
    message: 'La contraseña se cambió exitosamente.',
    buttons: ['OK'],
  });
  await alerta.present();
}

  async cambiarContrasena(){
    if (this.nuevaContrasena !== this.confirmarContrasena){
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'las contraseñas no coinciden.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }
    this.mostrarAlertaExito();
    this.contrasenaActual = '';
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
  }

  

}
