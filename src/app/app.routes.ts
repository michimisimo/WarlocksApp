import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.page').then(m => m.UserPage),
  },  {
    path: 'component-test',
    loadComponent: () => import('./pages/component-test/component-test.page').then( m => m.ComponentTestPage)
  },

]
