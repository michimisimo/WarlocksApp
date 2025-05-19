// src/app/components/plantel-tabla/plantel-tabla.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';

export type PositionGroup = 'Bases' | 'Aleros' | 'Pivots';


@Component({
  selector: 'app-plantel-tabla',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './plantel-tabla.component.html',
  styleUrls: ['./plantel-tabla.component.scss'],
})
export class PlantelTablaComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() players: TeamMember[] = [];
  @Input() positionFilter: PositionGroup = 'Bases';
  @Input() categoryFilter: string = '';
  @Output() playerSelected = new EventEmitter<TeamMember>();

  displayedPlayers: TeamMember[] = [];
  private readonly DEFAULT_NUMBER = 10;

  ngOnInit() {
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['players'] ||
      changes['positionFilter'] ||
      changes['categoryFilter']
    ) {
      this.applyFilters();
    }
  }

  private applyFilters() {
    this.displayedPlayers = this.players
      .filter(p => p.rol === 'jugador')
      .filter(p => this.positionMatches(p))
      .filter(p => this.categoryMatches(p));
  }

  selectPlayer(player: TeamMember) {
    this.playerSelected.emit(player);
  }

  /** Formatea con dos dígitos */
  padJersey(num: number = this.DEFAULT_NUMBER): string {
    return num < 10 ? '0' + num : '' + num;
  }

  /** Ruta al PNG según el número (por defecto 10) */
  jerseySrc(num: number = this.DEFAULT_NUMBER): string {
    const code = this.padJersey(num);
    return `/assets/poleras/${code}.png`;
  }

  private positionMatches(player: TeamMember): boolean {
    const pos = (player.posicion || '').toLowerCase();
    if (this.positionFilter === 'Bases') {
      return pos === 'base' || pos === 'escolta';
    }
    if (this.positionFilter === 'Aleros') {
      return pos === 'alero' || pos === 'ala-pivot';
    }
    if (this.positionFilter === 'Pivots') {
      return pos === 'pivot';
    }
    return false;
  }

  private categoryMatches(player: TeamMember): boolean {
    return (
      player.categoria === this.categoryFilter
    );
  }
}
