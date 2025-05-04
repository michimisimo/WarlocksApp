import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { PartidoModel } from '../mappers/map-partido/map-partido.service';

@Injectable({ providedIn: 'root' })

export class PartidoService {

  private storageKey = 'partidos';

  constructor(private storage: Storage) { }

  async init(): Promise<void> {
    await this.storage.create();
  }



  async guardarPartido(id: string, partido: PartidoModel): Promise<void> {
    await this.storage.set(`${this.storageKey}:${id}`, partido);
  }

  async obtenerPartido(id: string): Promise<PartidoModel | null> {
    return await this.storage.get(`${this.storageKey}:${id}`);
  }

  async eliminarPartido(id: string): Promise<void> {
    await this.storage.remove(`${this.storageKey}:${id}`);
  }

  async obtenerTodosLosPartidos(): Promise<{ [id: string]: PartidoModel }> {
    const keys = await this.storage.keys();
    const partidos: { [id: string]: PartidoModel } = {};

    for (const key of keys.filter(k => k.startsWith(this.storageKey))) {
      const id = key.replace(`${this.storageKey}:`, '');
      const partido = await this.storage.get(key);
      partidos[id] = partido;
    }

    return partidos;
  }
}
