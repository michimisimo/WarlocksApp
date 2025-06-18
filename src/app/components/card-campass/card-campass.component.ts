import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { SincronizarUserService } from 'src/app/services/sincronizar/sincronizar-user/sincronizar-user.service';
import { CurrentUser } from 'src/app/services/mappers/map-user/map-user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-card-campass',
  standalone: true,
  templateUrl: './card-campass.component.html',
  styleUrls: ['./card-campass.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CardCampassComponent implements OnInit {

  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  contrasenaActual: string = '';
  currentUser: CurrentUser | null = null;

  constructor(
    private alertCtrl: AlertController,
    private userService: UserService,
    private syncUserService: SincronizarUserService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.userService.getCurrentUser();
  }

  async mostrarAlertaExito() {
    const alerta = await this.alertCtrl.create({
      header: 'Éxito',
      message: 'La contraseña se cambió exitosamente.',
      buttons: ['OK'],
    });
    await alerta.present();
  }

  async cambiarContrasena() {
    // 2) Validamos que las nuevas contraseñas coincidan
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    // 3) Validamos longitud mínima
    if (this.nuevaContrasena.length < 8) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'La contraseña debe tener al menos 8 caracteres.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    // 1) Inicialmente intentamos “loguear” con la contraseña actual
    try {
      await firstValueFrom(
        this.syncUserService.syncUser(this.currentUser!.rut!, this.contrasenaActual)
      );
      // Si llega aquí, la contraseña actual es válida
    } catch (err) {
      // Si syncUser lanza error, mostramos alerta y salimos
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'La contraseña actual ingresada no coincide.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    // 4) Aquí llamas al servicio que realmente cambia la contraseña en tu API
    // try {
    //   await firstValueFrom(
    //     this.syncUserService.syncUser(this.currentUser!.rut!, this.nuevaContrasena)
    //   );
    // } catch (err) {
    //   const alert = await this.alertCtrl.create({
    //     header: 'Error',
    //     message: 'No se pudo cambiar la contraseña. Intenta de nuevo más tarde.',
    //     buttons: ['Ok']
    //   });
    //   await alert.present();
    //   return;
    // }

    // 5) Éxito
    this.mostrarAlertaExito();

    // 6) Limpiamos campos
    this.contrasenaActual = '';
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
  }

}
