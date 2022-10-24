import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VariantsService } from './variants.service';

describe('VariantsService', () => {
  let service: VariantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(VariantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
