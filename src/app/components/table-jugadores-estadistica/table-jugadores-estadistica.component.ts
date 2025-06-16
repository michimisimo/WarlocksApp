import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  standalone: true,
  selector: 'app-table-jugadores-estadistica',
  templateUrl: './table-jugadores-estadistica.component.html',
  styleUrls: ['./table-jugadores-estadistica.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class TableJugadoresEstadisticaComponent implements OnInit {

  @Input() jugadores: TeamMember[] = [];

  @Output() enviarJugador = new EventEmitter<TeamMember>();

  jugadoresTitulares: TeamMember[] = [];
  jugadoresBanca: TeamMember[] = [];

  estadoCronometros = new Map<string, boolean>();

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jugadores']) {
      console.log(this.jugadores)
      const rutsInput = this.jugadores.map(j => j.rut);

      this.jugadoresTitulares = this.jugadoresTitulares.filter(j => rutsInput.includes(j.rut))
      this.jugadoresBanca = this.jugadoresBanca.filter(j => rutsInput.includes(j.rut))

      const rutsTitulares = this.jugadoresTitulares.map(j => j.rut);
      const rutsBanca = this.jugadoresBanca.map(j => j.rut);

      this.jugadores.forEach(jugador => {
        if (!rutsTitulares.includes(jugador.rut) && !rutsBanca.includes(jugador.rut)) {
          this.jugadoresBanca.push(jugador);
        }
      })
    };
  }

  hacerCambio(jugador: TeamMember) {
    const esTitular = this.jugadoresTitulares.some(j => j.rut === jugador.rut);

    if (esTitular) {
      // Mover de cancha a banca
      this.jugadoresTitulares = this.jugadoresTitulares.filter(j => j.rut !== jugador.rut);
      this.jugadoresBanca.push(jugador);
    } else {
      // Mover de banca a cancha
      this.jugadoresBanca = this.jugadoresBanca.filter(j => j.rut !== jugador.rut);
      this.jugadoresTitulares.push(jugador);
    }
  }

  agregar(jugador: TeamMember) {
    this.enviarJugador.emit(jugador);
  }

}


