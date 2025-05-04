import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { CurrentUser } from '../mappers/map-user/map-user.service';

const CURRENT_USER_KEY = 'current_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _ready = this.storage.create();

  constructor(private storage: Storage) { }

  /** Init (si lo necesitas explícito) */
  async init() {
    await this._ready;
  }

  /** Guarda el perfil completo (incluye rol y apiKey) */
  async saveCurrentUser(user: CurrentUser): Promise<void> {
    await this._ready;
    await this.storage.set(CURRENT_USER_KEY, user);
  }

  /** Recupera tu perfil */
  async getCurrentUser(): Promise<CurrentUser | null> {
    await this._ready;
    return (await this.storage.get(CURRENT_USER_KEY)) as CurrentUser | null;
  }

  /** Borra tu perfil (logout) */
  async removeCurrentUser(): Promise<void> {
    await this._ready;
    await this.storage.remove(CURRENT_USER_KEY);
  }
}
