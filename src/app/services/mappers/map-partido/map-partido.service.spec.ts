import { TestBed } from '@angular/core/testing';

import { MapPartidoService } from './map-partido.service';

describe('MapPartidoService', () => {
  let service: MapPartidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapPartidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
