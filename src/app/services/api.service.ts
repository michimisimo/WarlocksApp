import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(usuario: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'rol': 'jugador',
      'api-key': 'clavejugador456',
    });

    return this.http.post(`${this.apiUrl}/login`, { usuario, password }, { headers });
  }

  getPartidos() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'rol': 'jugador',
      'api-key': 'clavejugador456',
    });
    return this.http.get(`${this.apiUrl}/getPartidos`, { headers });
  }
}
