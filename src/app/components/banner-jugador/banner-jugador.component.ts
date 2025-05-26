import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamMember } from 'src/app/services/mappers/map-user/map-user.service';
import { Location, CommonModule } from '@angular/common';
import { Router, } from '@angular/router';

@Component({
  selector: 'app-banner-jugador',
  templateUrl: './banner-jugador.component.html',
  styleUrls: ['./banner-jugador.component.scss'],
  imports: [CommonModule]
})
export class BannerJugadorComponent implements OnInit {

  activeTab: string = "Temporada"
  tabs = ['Temporada', 'Historico']

  @Input() jugador: TeamMember | undefined
  @Output() tabChanged = new EventEmitter<string>();

  constructor(private location: Location,
    private router: Router,
  ) { }

  ngOnInit() { }

  selectedTab(tab: any) {
    console.log(tab)
    this.activeTab = tab;
  }

  padJersey(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  jerseySrc(num: number): string {
    const code = this.padJersey(num);
    return `/assets/poleras/${code}.png`;
  }

  //metodo para la navegacion 
  onClickConfig() {
    this.router.navigate(['/user'])
  }
  //metodo navegacion
  onClickBack() {
    this.router.navigate(['/inicio'])
  }

  cambiarTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
  }

}
