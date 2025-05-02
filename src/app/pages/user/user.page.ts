import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BannerTopComponent } from 'src/app/components/banner-top/banner-top.component';

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
  activeTab = '';

  constructor() { }

  ngOnInit() {
    this.activeTab = 'Mi cuenta';
  }

  ngAfterViewInit() { }

}
