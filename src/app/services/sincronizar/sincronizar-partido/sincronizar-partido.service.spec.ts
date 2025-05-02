import { TestBed } from '@angular/core/testing';

import { SincronizarPartidoService } from './sincronizar-partido.service';

describe('SincronizarPartidoService', () => {
  let service: SincronizarPartidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SincronizarPartidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
