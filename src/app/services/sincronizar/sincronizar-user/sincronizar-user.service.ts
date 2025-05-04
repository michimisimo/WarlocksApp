import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../user/user.service';
import { CurrentUser } from '../../mappers/map-user/map-user.service';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SincronizarUserService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private userService: UserService) { }

  /**
   * Hace login y guarda tu perfil (incluye rol + apiKey) en Storage
   */
  syncUser(usuario: string, password: string): Observable<CurrentUser> {
    return from(this.userService.init()).pipe(

      // 1) Una vez listo el Storage, preparamos headers
      switchMap(() => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'rol': 'jugador',
          'api-key': 'clavejugador456',
        });
        return this.http.post<{ user: CurrentUser }>(
          `${this.apiUrl}/user/login`,
          { usuario, password },
          { headers }                      // ← aquí pasas los headers
        );
      }),

      // 2) Validamos que haya user en la respuesta
      tap(res => {
        if (!res.user) {
          throw new Error('No se obtuvo perfil de usuario');
        }
      }),

      // 3) Guardamos en Storage y emitimos solo el CurrentUser
      switchMap(res =>
        from(this.userService.saveCurrentUser(res.user)).pipe(
          map(() => res.user)
        )
      )

    );
  }

}