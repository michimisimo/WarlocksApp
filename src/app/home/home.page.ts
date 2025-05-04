import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonButton, IonSpinner} from '@ionic/angular/standalone';
import { SincronizarUserService } from '../services/sincronizar/sincronizar-user/sincronizar-user.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonButton, FormsModule,IonSpinner,CommonModule]
})
export class HomePage {

  rut: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private syncUserService: SincronizarUserService,
    private userService: UserService,
    private router: Router) { }

  async ngOnInit(){
    const CurrentUser = await this.userService.getCurrentUser();
    if (CurrentUser){
      this.router.navigate(['/inicio']);
    }
  }

  soloNumeros(event: any) {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, '').slice(0, 8); // Reemplaza todo lo que no sea un número y limita a 8 caracteres
    event.target.value = input; // Asigna el valor procesado al input
  }

  login() {
    if (this.rut && this.password) {
      this.isLoading = true;  // spinner
      console.log('Datos válidos. Realizando autenticación...');
      this.syncUserService.syncUser(this.rut, this.password).subscribe({
        next: (respuesta) => {
          console.log('Login exitoso', respuesta);
          this.isLoading = false; // ocultar spinner
          this.router.navigate(['/inicio']); // <-- Navega a 'pages/inicio'
        },
        error: (error) => {
          console.error('Error de login', error);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Por favor, ingresa un RUT y contraseña válidos');
    }
  }
}
