import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';

import { CardPartidoComponent } from 'src/app/components/card-partido/card-partido.component';
import { BannerTopComponent } from 'src/app/components/banner-top/banner-top.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [BannerTopComponent, CardPartidoComponent, IonContent, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {

  partidos: any[] = [];
  partidosFiltrados: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getpartidos();  // Obtenemos los partidos al inicio
  }

  // Método para obtener los partidos desde la API
  getpartidos() {
    this.apiService.getPartidos().subscribe(
      (response: any) => {
        this.partidos = response; // Asigna el array de partidos
        console.log('partidos:', this.partidos);
        this.filtrarPartidosPorCategoria('U 11');  // Filtra por categoría U 11 después de obtener los datos
      },
      (error) => {
        console.error('Error al obtener los partidos:', error);
      }
    );
  };

  // Método que filtra los partidos según la categoría seleccionada
  filtrarPartidosPorCategoria(categoria: string) {
    const categoriaNum = this.getCategoriaNum(categoria);
    this.partidosFiltrados = this.partidos.filter(partido => partido.id_categoria === categoriaNum);
  }

  // Convertir categoría a número para hacer el filtrado
  getCategoriaNum(categoria: string): number {
    switch (categoria) {
      case 'U 11':
        return 1;
      case 'U 13':
        return 2;
      case 'U 15':
        return 3;
      case 'U 18':
        return 4;
      default:
        return 0;  // En caso de que la categoría no esté definida
    }
  }

  // Aquí escuchamos el evento de categoría seleccionada y filtramos
  onCategorySelected(category: string) {
    this.filtrarPartidosPorCategoria(category);
  }

}
