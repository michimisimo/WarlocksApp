import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
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

    const headers = await this.getHeaders();

    const versionesServidor = await this.obtenerVersionesDelServidor(headers);
    if (!versionesServidor) return;

    const partidosLocales = await this.partidoService.obtenerTodosLosPartidos();
    const storageVacio = Object.keys(partidosLocales).length === 0;

    if (storageVacio) {
      await this.descargarTodosLosPartidos(headers, versionesServidor);
      console.log('✅ Sincronización completa desde cero.');
      return;
    }

    const versionesLocales = await this.versionService.obtenerTodasLasVersiones();
    const desactualizados = this.filtrarPartidosDesactualizados(versionesServidor, versionesLocales);

    await this.descargarYActualizar(desactualizados, headers);

    if (desactualizados.length === 0) {
      console.log('🟢 Todos los partidos están actualizados.');
    }
  }

  private async inicializarStorages() {
    await Promise.all([
      this.versionService.init(),
      this.partidoService.init()
    ]);
  }

  private async obtenerVersionesDelServidor(headers: HttpHeaders): Promise<{ id_partido: string; version: number }[] | null> {
    try {
      const response = await firstValueFrom(
        this.http
          .get<{ id_partido: string; version: number }[]>(`${this.apiUrl}/partidos/version`, { headers })
          .pipe(timeout(10000))
      );
      return response;
    } catch (error) {
      console.error('❌ Error al obtener versiones del servidor:', error);
      await this.presentOfflineToast('❌ No se pudo obtener datos del servidor.');
      return null;
    }
  }

  private filtrarPartidosDesactualizados(
    servidor: { id_partido: string; version: number }[],
    local: { [id: string]: number }
  ): { id_partido: string; version: number }[] {
    return servidor.filter(p => (p.version > (local[p.id_partido] || 0)));
  }

  private async descargarYActualizar(
    partidos: { id_partido: string; version: number }[],
    headers: HttpHeaders
  ): Promise<void> {
    for (const { id_partido, version } of partidos) {
      try {
        const rawArray = await this.http
          .get<RawPartido[]>(`${this.apiUrl}/partidos/${id_partido}`, { headers })
          .toPromise();

        if (!rawArray || rawArray.length === 0) {
          console.warn(`⚠️ Partido ${id_partido} llegó vacío. Eliminando localmente.`);
          await this.eliminarPartidoCompleto(id_partido);
          continue;
        }

        const model = mapRawToPartido(rawArray[0], version);
        await this.guardarPartidoConVersion(id_partido, model, version);
        console.log(`✅ Partido ${id_partido} actualizado a v${version}`);

      } catch (err) {
        console.error(`❌ Error al procesar partido ${id_partido}:`, err);
      }
    }
  }

  private async guardarPartidoConVersion(id: string, model: PartidoModel, version: number) {
    await this.partidoService.guardarPartido(id, model);
    await this.versionService.setVersion(id, version);
  }

  private async eliminarPartidoCompleto(id: string) {
    await this.partidoService.eliminarPartido(id);
    await this.versionService.eliminarVersion(id);
  }

  private async descargarTodosLosPartidos(headers: HttpHeaders, versiones: { id_partido: string; version: number }[]) {
    console.log('📥 Storage vacío. Descargando todos los partidos...');
    for (const { id_partido, version } of versiones) {
      try {
        const rawArray = await this.http
          .get<RawPartido[]>(`${this.apiUrl}/partidos/${id_partido}`, { headers })
          .toPromise();

        if (!rawArray || rawArray.length === 0) {
          console.warn(`⚠️ Partido ${id_partido} llegó vacío. Saltando.`);
          continue;
        }

        const model = mapRawToPartido(rawArray[0], version);
        await this.guardarPartidoConVersion(id_partido, model, version);
      } catch (err) {
        console.error(`❌ Error al descargar partido ${id_partido}:`, err);
      }
    }
  }

  async subirpartido(partido: any) {

    if (!await this.isOnline()) {
      console.warn('📴 Sin conexión, usando datos locales.');
      await this.presentOfflineToast();
      return;
    }

    const headers = await this.getHeaders();

    try {
      const respuesta = await this.http
        .post<any>(`${this.apiUrl}/partidos/`, partido, { headers })
        .toPromise();

      console.log('Respuesta backend partido:', respuesta);
    } catch (err) {
      console.error('Error al subir estadística o nómina:', err);
    }
  }

}
