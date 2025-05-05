import { TestBed } from '@angular/core/testing';

import { SincronizarMiembrosService } from './sincronizar-miembros.service';

describe('SincronizarMiembrosService', () => {
  let service: SincronizarMiembrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SincronizarMiembrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
