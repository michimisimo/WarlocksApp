import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { PartidoModel } from 'src/app/services/mappers/map-partido/map-partido.service';
import { MiembrosService } from 'src/app/services/miembros/miembros.service';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

@Component({
  standalone: true,
  selector: 'app-table-seleccionar-plantel',
  templateUrl: './table-seleccionar-plantel.component.html',
  styleUrls: ['./table-seleccionar-plantel.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class TableSeleccionarPlantelComponent implements OnInit {

  @Input() partido!: PartidoModel;

  @Output() entrenadoresActualizados = new EventEmitter<TeamMember[]>();
  @Output() jugadoresActualizados = new EventEmitter<TeamMember[]>();

  jugadores: TeamMember[] = [];
  entrenadores: TeamMember[] = [];
  jugadoresNomina: TeamMember[] = [];
  entrenadoresNomina: TeamMember[] = [];

  constructor(
    private miembrosService: MiembrosService,
  ) { }

  async ngOnInit(
  ) {
    await this.getJugadores(this.partido!.info_global!.id_categoria!)
  }

  async getJugadores(cat: number) {
    // Diccionario de categorías
    const categorias: { [key: number]: string } = {
      1: 'U11',
      2: 'U13',
      3: 'U15',
      4: 'U18',
    };

    // Obtener nombre de la categoría
    const nombreCategoria = categorias[cat];
    const miembros = await this.miembrosService.getAllMembers();

    this.jugadores = Object.values(miembros)
      .filter((data: any) => data.categoria === nombreCategoria);

    this.entrenadores = Object.values(miembros)
      .filter((data: any) => data.categoria === "ALL");


  }



  agregarUsuario(event: any) {
    const seleccionados: TeamMember[] = event.detail.value;

    // Evitar duplicados
    seleccionados.forEach(usuario => {
      const yaExiste = this.entrenadoresNomina.some(e => e.rut === usuario.rut) || this.jugadoresNomina.some(j => j.rut === usuario.rut)

      if (!yaExiste) {
        if (usuario.rol === 'jugador') {
          this.jugadoresNomina.push(usuario);
          this.jugadoresActualizados.emit(this.jugadoresNomina);
        } else {
          this.entrenadoresNomina.push(usuario)
          this.entrenadoresActualizados.emit(this.entrenadoresNomina);
        }
      }
    })
  }

  onEditar(usuario: any) {
    console.log('Editar usuario', usuario);
    // Lógica para editar
  }

  onEliminar(usuario: any) {
    if (usuario.rol! === 'jugador') {
      this.jugadoresNomina = this.jugadoresNomina.filter(u => u.rut !== usuario.rut)
      this.jugadoresActualizados.emit(this.jugadoresNomina);
    } else {
      this.entrenadoresNomina = this.entrenadoresNomina.filter(u => u.rut !== usuario.rut)
      this.entrenadoresActualizados.emit(this.entrenadoresNomina);

    }
  }


}
