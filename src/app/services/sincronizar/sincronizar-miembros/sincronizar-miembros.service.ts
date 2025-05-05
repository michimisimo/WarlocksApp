import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VersionMiembrosService } from '../../version/version-miembros/version-miembros.service';
import { MiembrosService } from '../../miembros/miembros.service';
import { TeamMember } from '../../mappers/map-user/map-user.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SincronizarMiembrosService {
  private apiUrl = environment.apiUrl;
  private CURRENT_USER_KEY = 'current_user';

  constructor(
    private http: HttpClient,
    private versionService: VersionMiembrosService,
    private miembroService: MiembrosService,
    private storage: Storage,
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
    const currentUser: any = await this.storage.get(this.CURRENT_USER_KEY);
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

  private async cargarMiembrosLocal(): Promise<void> {
    const all = await this.miembroService.getAllMembers();
    console.log('📂 Miembros cargados desde storage:', all);
  }

  private async downloadAllMiembros(headers: HttpHeaders): Promise<void> {
    try {
      const allReq$ = this.http
        .get<TeamMember[]>(`${this.apiUrl}/miembro_equipo`, { headers })
        .pipe(timeout(20000));
      const allMembers = await firstValueFrom(allReq$);
      for (const member of allMembers) {
        await this.miembroService.saveMember(member);
        if ((member as any).version !== undefined) {
          await this.versionService.setVersion(member.rut, (member as any).version);
        }
      }
      console.log(`✅ Descargados ${allMembers.length} miembros.`);
    } catch (err) {
      console.error('❌ Error al hacer bulk fetch de miembros:', err);
      await this.presentOfflineToast();
      return this.cargarMiembrosLocal();
    }
  }

  private async sincronizarVersiones(serverVersions: { rut: string; version: number }[], localVersions: { [rut: string]: number }, headers: HttpHeaders): Promise<void> {
    const toUpdate = serverVersions.filter(sv => {
      const local = localVersions[sv.rut] || 0;
      return sv.version > local;
    });

    console.log(`🔎 ${toUpdate.length} miembros desactualizados.`);

    for (const sv of toUpdate) {
      try {
        const detailReq$ = this.http
          .get<TeamMember>(`${this.apiUrl}/miembro_equipo/${sv.rut}`, { headers })
          .pipe(timeout(5000));
        const member = await firstValueFrom(detailReq$);
        if (!member) {
          console.warn(`⚠️ Miembro ${sv.rut} sin datos. Eliminando local.`);
          await this.miembroService.removeMember(sv.rut);
          await this.versionService.removeVersion(sv.rut);
          continue;
        }
        await this.miembroService.saveMember(member);
        await this.versionService.setVersion(sv.rut, sv.version);
        console.log(`✅ Miembro ${sv.rut} actualizado v${sv.version}`);
      } catch (err) {
        console.error(`❌ Error sincronizando ${sv.rut}:`, err);
      }
    }

    if (toUpdate.length === 0) {
      console.log('🟢 Todos los miembros están actualizados.');
    }
  }

  async sincronizarTodos(): Promise<void> {
    await this.storage.create();
    await this.versionService.init();
    await this.miembroService.init();

    // Verificar conexión
    if (!await this.isOnline()) {
      console.warn('📴 Sin conexión, usando datos locales.');
      await this.presentOfflineToast();
      return this.cargarMiembrosLocal();
    }

    const headers = await this.getHeadersFromStorage();
    if (!headers.get('api-key') || !headers.get('rol')) {
      console.warn('⚠️ Datos de usuario incompletos. Usando modo offline.');
      await this.presentOfflineToast();
      return this.cargarMiembrosLocal();
    }

    // Revisión de storage vacío y descarga completa
    const miembrosLocales = await this.miembroService.getAllMembers();
    if (Object.keys(miembrosLocales).length === 0) {
      console.log('📥 Storage de miembros vacío. Descargando todos los miembros…');
      return this.downloadAllMiembros(headers);
    }

    // Obtener versiones del servidor
    let serverVersions: { rut: string; version: number }[];
    try {
      const req$ = this.http
        .get<{ rut: string; version: number }[]>(
          `${this.apiUrl}/miembro_equipo/version`,
          { headers }
        )
        .pipe(timeout(20000));
      serverVersions = await firstValueFrom(req$);
    } catch (err) {
      console.error('❌ Error al obtener versiones (timeout o red):', err);
      await this.presentOfflineToast();
      return this.cargarMiembrosLocal();
    }

    // Leer versiones locales y actualizar miembros
    const localVersions = await this.versionService.getAllVersions();
    await this.sincronizarVersiones(serverVersions, localVersions, headers);
  }
}
