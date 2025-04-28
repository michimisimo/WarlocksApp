import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonButton } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonButton, FormsModule,]
})
export class HomePage {

  rut: string = '';
  password: string = '';

  constructor(private apiService: ApiService) { }

  soloNumeros(event: any) {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, '').slice(0, 8); // Reemplaza todo lo que no sea un número y limita a 8 caracteres
    event.target.value = input; // Asigna el valor procesado al input
  }

  login() {
    if (this.rut && this.password) {
      // Aquí puedes agregar la lógica de autenticación, por ejemplo, una llamada a un servicio
      console.log('Datos válidos. Realizando autenticación...');
      this.apiService.login(this.rut, this.password).subscribe({
        next: (respuesta) => {
          console.log('Login exitoso', respuesta);
          // Aquí haces navegación o guardas token
        },
        error: (error) => {
          console.error('Error de login', error);
        }
      })
    }
    else {
      console.log('Por favor, ingresa un RUT y contraseña válidos');
    }
  }

}
