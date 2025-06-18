import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import { MiembroEquipoBase, TeamMember } from '../../mappers/map-user/map-user.service';
import { MiembrosService } from '../../miembros/miembros.service';
import { VersionMiembrosService } from '../../version/version-miembros/version-miembros.service';
import { UserService } from '../../user/user.service';

@Injectable({ providedIn: 'root' })
export class SincronizarMiembrosService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private miembrosService: MiembrosService,
    private versionService: VersionMiembrosService,
    private userService: UserService,
    private toastController: ToastController
  ) { }

  private async presentToast(message: string, color: 'warning' | 'danger' = 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  private async getHeaders(): Promise<HttpHeaders> {
    const user = await this.userService.getCurrentUser();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'rol': user?.rol || '',
      'api-key': user?.api_key || ''
    });
  }

  private isOnline(): boolean {
    return navigator.onLine;
  }

  public async sincronizarTodos(): Promise<void> {
    // Initialize local storages
    await Promise.all([
      this.versionService.init(),
      this.miembrosService.init()
    ]);

    // Offline fallback
    if (!this.isOnline()) {
      console.warn('📴 Sin conexión, usando datos locales.');
      await this.presentToast('⚠️ Modo offline: mostrando datos almacenados.');
      return this.miembrosService.getAllMembers().then(all => console.log('📂 Miembros locales:', all));
    }

    // Prepare headers
    const headers = await this.getHeaders();
    if (!headers.get('api-key') || !headers.get('rol')) {
      console.warn('⚠️ Credenciales incompletas, modo offline.');
      await this.presentToast('⚠️ Usuario no autenticado, cargando local.');
      return this.miembrosService.getAllMembers().then(all => console.log('📂 Miembros locales:', all));
    }

    // Fetch server versions
    let serverVersions: Array<{ rut: string; version: number }>;
    try {
      serverVersions = await firstValueFrom(
        this.http
          .get<{ rut: string; version: number }[]>(`${this.apiUrl}/miembro_equipo/version`, { headers })
          .pipe(timeout(15000))
      );
    } catch (err) {
      console.error('❌ No se pudo obtener versiones del servidor:', err);
      await this.presentToast('❌ Error al consultar versiones, mostrando datos locales.', 'danger');
      return this.miembrosService.getAllMembers().then(all => console.log('📂 Miembros locales:', all));
    }

    const localMembers = await this.miembrosService.getAllMembers();
    const isEmpty = Object.keys(localMembers).length === 0;

    if (isEmpty) {
      // Bulk download if no local data
      await this.descargarTodos(headers, serverVersions);
      console.log('✅ Miembros descargados desde cero.');
    } else {
      // Compare and update only outdated
      const localVersions = await this.versionService.getAllVersions();
      const toUpdate = serverVersions.filter(sv => sv.version > (localVersions[sv.rut] || 0));

      if (toUpdate.length === 0) {
        console.log('🟢 Todos los miembros están actualizados.');
      } else {
        await this.actualizarMiembros(toUpdate, headers);
      }
    }
  }

  private async descargarTodos(
    headers: HttpHeaders,
    versions: Array<{ rut: string; version: number }>
  ): Promise<void> {
    console.log('📥 Descargando todos los miembros...');

    for (const { rut, version } of versions) {
      try {
        const response = await firstValueFrom(
          this.http
            .get<TeamMember[]>(`${this.apiUrl}/miembro_equipo/${rut}`, { headers })
            .pipe(timeout(10000))
        );

        const member = response[0]; // Aseguramos que se toma el primer miembro del array

        if (member) {
          await this.miembrosService.saveMember(member);
          await this.versionService.setVersion(rut, version);
          console.log(`✅ Miembro ${rut} guardado v${version}`);
        } else {
          console.warn(`⚠️ No se encontró miembro para RUT ${rut}`);
        }
      } catch (err) {
        console.error(`❌ Error descargando miembro ${rut}:`, err);
      }
    }

    console.log('📦 Estado final de miembros descargados:');
    const miembros = await this.miembrosService.getAllMembers();
    const miembrosArray = Object.values(miembros);

    miembrosArray.forEach((m: any) => {
      console.log(`📌 ${m.pnombre} ${m.appaterno} - RUT: ${m.rut}`);
    });
  }


  private async actualizarMiembros(
    updates: Array<{ rut: string; version: number }>,
    headers: HttpHeaders
  ): Promise<void> {
    for (const { rut, version } of updates) {
      try {
        const member = await firstValueFrom(
          this.http.get<TeamMember>(`${this.apiUrl}/miembro_equipo/${rut}`, { headers }).pipe(timeout(5000))
        );
        if (member) {
          await this.miembrosService.saveMember(member);
          await this.versionService.setVersion(rut, version);
          console.log(`✅ Miembro ${rut} actualizado a v${version}`);
        } else {
          console.warn(`⚠️ Miembro ${rut} sin datos, eliminando local.`);
          await this.miembrosService.removeMember(rut);
          await this.versionService.removeVersion(rut);
        }
      } catch (err) {
        console.error(`❌ Falló actualización de ${rut}:`, err);
      }
    }
    console.log('📦 Estado final de miembros actualizados:');
    const todos = await this.miembrosService.getAllMembers();
    console.log(todos);
  }

  public async postMiembro(miembro: TeamMember) {
    console.log("subiendo miembro");

    const headers = await this.getHeaders();

    try {
      const respuesta = await this.http
        .put<any>(`${this.apiUrl}/miembro_equipo/upsertMiembro/${miembro.rut}`, miembro, { headers })
        .toPromise();

      console.log('Respuesta backend miembro:', respuesta);

    } catch (err) {
      console.error('Error al subir estadística o nómina:', err);

    }
  }

  public async deleteMiembro(rut: string) {
    console.log("subiendo miembro");

    const headers = await this.getHeaders();

    try {
      const respuesta = await this.http
        .patch<any>(`${this.apiUrl}/miembro_equipo/deleteMiembro/${rut}`, { headers })
        .toPromise();

      console.log('Respuesta backend miembro:', respuesta);

    } catch (err) {
      console.error('Error al subir estadística o nómina:', err);

    }
  }


}