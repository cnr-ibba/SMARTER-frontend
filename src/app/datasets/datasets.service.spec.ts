import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SortDirection } from '@angular/material/sort';

import { environment } from '../../environments/environment';
import { DatasetsService } from './datasets.service';

describe('DatasetsService', () => {
  let service: DatasetsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(DatasetsService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Test for searching datasets', () => {
    const pageIndex = 0;
    const pageSize = 10;
    const sortActive = '';
    const sortDirection: SortDirection = "desc";
    const searchValue = 'adaptmap';

    const expectedUrl = `${environment.backend_url}/datasets?size=${pageSize}&search=${searchValue}`;

    service.getDatasets(sortActive, sortDirection, pageIndex, pageSize, searchValue).subscribe(
      (datasets) => {});

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  });

  it('Test for dataset detail', () => {
    const _id = "test-dataset"

    const expectedUrl = `${environment.backend_url}/datasets/${_id}`;
    service.getDataset(_id).subscribe((sample => {}));

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  });
});
