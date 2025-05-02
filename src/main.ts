import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';


import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    importProvidersFrom(IonicStorageModule.forRoot()),
    Storage
  ],
});