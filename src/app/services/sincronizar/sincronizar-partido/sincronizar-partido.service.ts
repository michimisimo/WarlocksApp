import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PartidoService } from '../../partido/partido.service';
import { VersionPartidoService } from '../../version/version-partido/version-partido.service';
import { PartidoModel, RawPartido, mapRawToPartido } from '../../mappers/map-partido/map-partido.service';
import { environment } from '../../../../environments/environment';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class SyncPartidoService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private partidoService: PartidoService,
    private versionService: VersionPartidoService,
    private storage: Storage
  ) { }

  async sincronizarTodos(): Promise<void> {

    // 1) Inicializar Storage
    await this.versionService.init();
    await this.partidoService.init();

    // 2) Headers comunes
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'rol': 'jugador',
      'api-key': 'clavejugador456',
    });

    // 3) Obtener versiones del servidor
    let serverData = await this.http
      .get<{ id_partido: string; version: number }[]>(`${this.apiUrl}/partidos/version`, { headers })
      .toPromise();

    // 3.1) Si no llegó data, salimos
    if (!serverData) {
      console.error('❌ No se recibió lista de versiones del servidor.');
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
          console.warn(`⚠️ Partido ${id} llegó vacío desde el servidor.`);
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
