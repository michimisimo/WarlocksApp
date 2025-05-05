import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastController } from '@ionic/angular';
import { timeout } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs';

import { UserService } from '../../user/user.service';
import { PartidoService } from '../../partido/partido.service';
import { VersionPartidoService } from '../../version/version-partido/version-partido.service';
import { PartidoModel, RawPartido, mapRawToPartido } from '../../mappers/map-partido/map-partido.service';

@Injectable({ providedIn: 'root' })
export class SyncPartidoService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private partidoService: PartidoService,
    private versionService: VersionPartidoService,
    private userService: UserService,
    private toastController: ToastController
  ) { }

  private async presentOfflineToast() {
    const toast = await this.toastController.create({
      message: '⚠️ Modo offline: mostrando datos almacenados.',
      duration: 3000,
      color: 'warning',
      position: 'bottom',
    });
    await toast.present();
  }

  private async getHeadersFromStorage(): Promise<HttpHeaders> {
    const currentUser = await this.userService.getCurrentUser();
    console.log(currentUser);
    const rol = currentUser?.rol || '';
    const apiKey = currentUser?.api_key || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'rol': rol,
      'api-key': apiKey,
    });
  }

  private async isOnline(): Promise<boolean> {
    return navigator.onLine;
  }

  async sincronizarTodos(): Promise<void> {
    await this.versionService.init();
    await this.partidoService.init();

    if (!await this.isOnline()) {
      console.warn('📴 Sin conexión, usando datos locales.');
      await this.presentOfflineToast();
      return;
    }

    const headers = await this.getHeadersFromStorage();
    console.log(headers);

    // 3) Obtener versiones del servidor
    let serverData;

    try {
      serverData = await this.http
        .get<{ id_partido: string; version: number }[]>(`${this.apiUrl}/partidos/version`, { headers })
        .pipe(
          timeout(7000)   // <— si pasan 5 s sin respuesta, salta al catch
        );

      serverData = await firstValueFrom(serverData);

    } catch (err) {
      console.error('❌ No se pudo obtener versiones del servidor:', err);
      await this.presentOfflineToast();
      return;
    }

    if (!serverData) {
      console.warn('⚠️ Lista de versiones llegó vacía.');
      await this.presentOfflineToast();
      return;
    }

    // 4) Filtrar desactualizados
    const versionesLocales = await this.versionService.obtenerTodasLasVersiones();
    const desactualizados = serverData.filter(p => {
      const vLocal = versionesLocales[p.id_partido] || 0;
      return p.version > vLocal;
    });
    console.log(`🔎 ${desactualizados.length} partidos desactualizados.`);

    // 5) Para cada partido, descargar detalle, mapear y guardar
    for (const p of desactualizados) {
      const id = p.id_partido;
      try {
        const rawArray = await this.http
          .get<RawPartido[]>(`${this.apiUrl}/partidos/${id}`, { headers })
          .toPromise();

        if (!rawArray || rawArray.length === 0) {
          console.warn(`⚠️ Partido ${id} llegó vacío. Eliminando localmente.`);
          await this.partidoService.eliminarPartido(id); // Método que debes tener en tu servicio
          await this.versionService.eliminarVersion(id);
          continue;
        }

        const raw = rawArray[0];
        const model: PartidoModel = mapRawToPartido(raw, p.version);

        await this.partidoService.guardarPartido(id, model);
        await this.versionService.setVersion(id, p.version);
        console.log(`✅ Partido ${id} actualizado a v${p.version}`);
      } catch (err) {
        console.error(`❌ Error al procesar partido ${id}:`, err);
      }
    }

    if (desactualizados.length === 0) {
      console.log('🟢 Todos los partidos están actualizados.');
    }
  }
}
