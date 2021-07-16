import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DatasetsService } from './datasets.service';

describe('DatasetsService', () => {
  let service: DatasetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(DatasetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
