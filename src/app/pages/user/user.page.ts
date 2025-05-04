import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BannerTopComponent } from 'src/app/components/banner-top/banner-top.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BannerTopComponent]
})
export class UserPage implements OnInit, AfterViewInit {

  @ViewChild(BannerTopComponent) componente!: BannerTopComponent;

  tabs = ['Mi cuenta', 'Usuarios'];
  activeTab = 'Mi Cuenta';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.activeTab = 'Mi cuenta';
    this.updateCategoryVisibility();
  }

  ngAfterViewInit() {
    this.updateCategoryVisibility();
  }

  updateCategoryVisibility() {
    // Si estamos en 'Mi cuenta', ocultamos las categorías
    if (this.componente) {
      this.componente.showCat3 = this.activeTab === 'Usuarios';
    }
  }

  cambiarTab(tab: string) {
    this.activeTab = tab;
    this.updateCategoryVisibility();
  }

  volverAInicio(){
    this.router.navigate(['/inicio'])
  }

}
