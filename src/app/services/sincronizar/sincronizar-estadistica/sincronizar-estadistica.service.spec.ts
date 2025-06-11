import { TestBed } from '@angular/core/testing';

import { SincronizarEstadisticaService } from './sincronizar-estadistica.service'

describe('SincronizarEstadisticaService', () => {
  let service: SincronizarEstadisticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SincronizarEstadisticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
