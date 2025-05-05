import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const VERSION_MIEMBROS_KEY = 'versiones_miembros';

@Injectable({
  providedIn: 'root'
})
export class VersionMiembrosService {
  private _ready: Promise<Storage>;


  constructor(private storage: Storage) {
    this._ready = this.storage.create();
  }

  /** Inicializa el storage */
  async init(): Promise<void> {
    await this._ready;
  }

  /** Obtiene la versión local de un miembro por su rut */
  async getVersion(rut: string): Promise<number> {
    await this._ready;
    const v = await this.storage.get(`${VERSION_MIEMBROS_KEY}:${rut}`);
    return v ?? 0;
  }

  /** Guarda/actualiza la versión de un miembro */
  async setVersion(rut: string, version: number): Promise<void> {
    await this._ready;
    await this.storage.set(`${VERSION_MIEMBROS_KEY}:${rut}`, version);
  }

  /** Elimina la versión local de un miembro */
  async removeVersion(rut: string): Promise<void> {
    await this._ready;
    await this.storage.remove(`${VERSION_MIEMBROS_KEY}:${rut}`);
  }

  /** Retorna un objeto con todas las versiones locales */
  async getAllVersions(): Promise<{ [rut: string]: number }> {
    await this._ready;
    const keys = await this.storage.keys();
    const result: { [rut: string]: number } = {};
    for (const key of keys.filter(k => k.startsWith(VERSION_MIEMBROS_KEY + ':'))) {
      const rut = key.replace(`${VERSION_MIEMBROS_KEY}:`, '');
      const v = await this.storage.get(key);
      result[rut] = v;
    }
    return result;
  }

  /** Limpia todas las versiones */
  async clearAll(): Promise<void> {
    await this._ready;
    const keys = await this.storage.keys();
    for (const key of keys.filter(k => k.startsWith(VERSION_MIEMBROS_KEY + ':'))) {
      await this.storage.remove(key);
    }
  }

}
