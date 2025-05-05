// tipos de rol posibles
export type Role = 'jugador' | 'entrenador' | 'estadistico';

// campos comunes a cualquier miembro del equipo
export interface MiembroEquipoBase {
  rut: string;
  dv_rut?: string;
  pnombre?: string;
  snombre?: string;
  appaterno?: string;
  apmaterno?: string;
  categoria?: string;
  posicion?: string;
  // …otros campos públicos…
}

// tu propio usuario, con credenciales y rol
export interface CurrentUser extends MiembroEquipoBase {
  rol: Role;
  api_key: string;
}

// otros miembros del equipo, solo datos públicos
export interface TeamMember extends MiembroEquipoBase {
  // sin rol, sin apiKey
}
