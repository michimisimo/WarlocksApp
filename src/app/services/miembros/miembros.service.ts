import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TeamMember } from '../mappers/map-user/map-user.service';

const MIEMBROS_KEY = 'miembros_equipo';

@Injectable({
  providedIn: 'root'
})


export class MiembrosService {

  private _ready: Promise<Storage>;

  constructor(private storage: Storage) {
    this._ready = this.storage.create();
  }

  async init(): Promise<void> {
    await this._ready;
    const data = await this.storage.get(MIEMBROS_KEY);
    if (!data) {
      await this.storage.set(MIEMBROS_KEY, {});
    }
  }

  async getAllMembers(): Promise<{ [rut: string]: TeamMember }> {
    const data = await this.storage.get(MIEMBROS_KEY);
    return data || {};
  }

  async getMember(rut: string): Promise<TeamMember | null> {
    const all = await this.getAllMembers();
    return all[rut] || null;
  }

  async saveMember(member: TeamMember): Promise<void> {
    const all = await this.getAllMembers();
    all[member.rut] = member;
    await this.storage.set(MIEMBROS_KEY, all);
  }

  async removeMember(rut: string): Promise<void> {
    const all = await this.getAllMembers();
    delete all[rut];
    await this.storage.set(MIEMBROS_KEY, all);
  }

  async clearAll(): Promise<void> {
    await this.storage.remove(MIEMBROS_KEY);
  }

}
