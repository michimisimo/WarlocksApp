import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerTopComponent } from 'src/app/components/banner-top/banner-top.component';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BannerTopComponent, IonicModule]
})
export class UserPage implements OnInit, AfterViewInit {

  @ViewChild(BannerTopComponent) componente!: BannerTopComponent;

  tabs = ['Mi cuenta', 'Usuarios'];
  activeTab = 'Mi Cuenta';

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.activeTab = 'Mi cuenta';
    this.showCategoria();
  }

  ngAfterViewInit() {
    this.showCategoria();
  }

  showCategoria() {
    // Si estamos en 'Mi cuenta', ocultamos las categorías
    if (this.componente) {
      this.componente.showCat3 = this.activeTab === 'Usuarios';
    }
  }

  cambiarTab(tab: string) {
    this.activeTab = tab;
    this.showCategoria();
  }

  volverAInicio(){
    this.router.navigate(['/inicio'])
  }

  cerrarSesion(){
    this.userService.removeCurrentUser();
    this.router.navigate(['/home'])
  }

}
