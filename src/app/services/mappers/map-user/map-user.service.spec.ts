import { TestBed } from '@angular/core/testing';

import { MapUserService } from './map-user.service';

describe('MapUserService', () => {
  let service: MapUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
