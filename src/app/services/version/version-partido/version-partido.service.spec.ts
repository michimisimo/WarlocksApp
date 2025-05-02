import { TestBed } from '@angular/core/testing';

import { VersionPartidoService } from './version-partido.service';

describe('VersionPartidoService', () => {
  let service: VersionPartidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionPartidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
