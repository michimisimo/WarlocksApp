import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';

import { PartidoService } from '../../partido/partido.service';
import { UserService } from '../../user/user.service';
import { PartidoModel } from '../../mappers/map-partido/map-partido.service';

@Injectable({
  providedIn: 'root'
})

export class SincronizarEstadisticaService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private partidoService: PartidoService,
    private userService: UserService,
    private toastController: ToastController
  ) { }

  private async presentOfflineToast(message: string = '⚠️ Modo offline: mostrando datos almacenados.') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'warning',
      position: 'bottom',
    });
    await toast.present();
  }

  private async getHeaders(): Promise<HttpHeaders> {
    const user = await this.userService.getCurrentUser();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'rol': user?.rol || '',
      'api-key': user?.api_key || '',
    });
  }

  private async isOnline(): Promise<boolean> {
    return navigator.onLine;
  }

  public async sincronizarTodos(): Promise<void> {
    await this.inicializarStorages();

    if (!await this.isOnline()) {
      console.warn('📴 Sin conexión, usando datos locales.');
      await this.presentOfflineToast();
      return;
    }
  }

  private async inicializarStorages() {
    await Promise.all([
      this.partidoService.init()
    ]);
  }

  public async descargarEstadistica(id_partido: string) {

    console.log("descargando estadistica")

    const headers = await this.getHeaders();

    try {
      const raw = await this.http
        .get<any>(`${this.apiUrl}/estadistica/${id_partido}`, { headers })
        .toPromise();

      const nomina = await this.http
        .get<any>(`${this.apiUrl}/nomina/${id_partido}`, { headers })
        .toPromise();

      if (!raw) {
        console.warn(`⚠️ Estadística de partido id ${id_partido} no existe.`);
        return;
      }

      // Obtengo partido actual guardado en storage
      const partidoExistente = await this.partidoService.obtenerPartido(id_partido);
      if (!partidoExistente) {
        console.warn(`⚠️ Partido con id ${id_partido} no encontrado en storage.`);
        return;
      }

      // Actualizo sólo la propiedad estadisticas dentro del partido
      const partidoActualizado: PartidoModel = {
        ...partidoExistente,
        estadisticas: {
          lanzamientos: raw.lanzamientos || [],
          rebotes: {
            ofensivos: (raw.rebotes || []).filter((r: any) => r.nombre_rebote === 'Ofensivo'),
            defensivos: (raw.rebotes || []).filter((r: any) => r.nombre_rebote === 'Defensivo'),
          },
          asistencias: raw.asistencias || [],
          robos: raw.robos || [],
          faltas: raw.faltas || [],
          bloqueos: raw.bloqueos || [],
          tiempo_juego: raw.minutos || [],
        },
        nomina: nomina || []
      };

      await this.partidoService.guardarPartido(id_partido, partidoActualizado);

    } catch (err) {
      console.error(`❌ Error al descargar estadística del partido ${id_partido}:`, err);
    }
  }

  public async getEstadisticaByJugador(rut: string) {
    const headers = await this.getHeaders();

    try {
      const estadisticas = await this.http
        .get<any>(`${this.apiUrl}/estadistica/jugador/${rut}`, { headers })
        .toPromise();

      const nomina = await this.http
        .get<any>(`${this.apiUrl}/nomina/jugador/${rut}`, { headers })
        .toPromise();

      if (!estadisticas) {
        console.warn(`⚠️ Estadística de jugador ${rut} no existe.`);
        return;
      }

      const estadisticaJugador = {
        estadisticas: {
          lanzamientos: estadisticas.lanzamientos || [],
          rebotes: {
            ofensivos: (estadisticas.rebotes || []).filter((r: any) => r.nombre_rebote === 'Ofensivo'),
            defensivos: (estadisticas.rebotes || []).filter((r: any) => r.nombre_rebote === 'Defensivo'),
          },
          asistencias: estadisticas.asistencias || [],
          robos: estadisticas.robos || [],
          faltas: estadisticas.faltas || [],
          bloqueos: estadisticas.bloqueos || [],
          tiempo_juego: estadisticas.minutos || [],
        },
        nomina: nomina || []
      };

      return estadisticaJugador;

    } catch (err) {
      console.error(`❌ Error al descargar estadística del jugador ${rut}:`, err);
      return;
    }
  }

  public async subirEstadistica(id_partido: string, estadistica: any, nomina: any) {
    console.log("subiendo estadistica");

    const headers = await this.getHeaders();

    try {
      const respuesta = await this.http
        .post<any>(`${this.apiUrl}/estadistica/${id_partido}`, estadistica, { headers })
        .toPromise();

      const nominaRes = await this.http
        .post<any>(`${this.apiUrl}/nomina/${id_partido}`, nomina, { headers })
        .toPromise();

      console.log('Respuesta backend estadistica:', respuesta);
      console.log('Respuesta backend nomina:', nominaRes);

    } catch (err) {
      console.error('Error al subir estadística o nómina:', err);

    }
  }

}

