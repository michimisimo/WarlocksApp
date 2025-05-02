import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class VersionPartidoService {
  private storageKey = 'versiones_partido';

  constructor(private storage: Storage) { }

  async init(): Promise<void> {
    await this.storage.create();
  }

  async getVersion(id: string): Promise<number> {
    const version = await this.storage.get(`${this.storageKey}:${id}`);
    return version ?? 0; // Si no existe, asumimos versión 0
  }

  async setVersion(id: string, version: number): Promise<void> {
    await this.storage.set(`${this.storageKey}:${id}`, version);
  }

  async eliminarVersion(id: string): Promise<void> {
    await this.storage.remove(`${this.storageKey}:${id}`);
  }

  async obtenerTodasLasVersiones(): Promise<{ [id: string]: number }> {
    const keys = await this.storage.keys();
    const resultado: { [id: string]: number } = {};

    for (const key of keys.filter(k => k.startsWith(this.storageKey))) {
      const valor = await this.storage.get(key);
      resultado[key.replace(`${this.storageKey}:`, '')] = valor;
    }

    return resultado;
  }
}
