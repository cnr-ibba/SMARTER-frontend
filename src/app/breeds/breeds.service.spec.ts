import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SortDirection } from '@angular/material/sort';

import { environment } from '../../environments/environment';
import { BreedsService } from './breeds.service';

describe('BreedsService', () => {
  let service: BreedsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(BreedsService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Test for searching breed', () => {
    const pageIndex = 0;
    const pageSize = 10;
    const sortActive = '';
    const sortDirection: SortDirection = "desc";
    const searchValue = 'merino';

    const expectedUrl = `${environment.backend_url}/breeds?species=${service.selectedSpecie}&size=${pageSize}&search=${searchValue}`;

    service.getBreeds(sortActive, sortDirection, pageIndex, pageSize, searchValue).subscribe(
      (breeds) => {});

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  });

});
