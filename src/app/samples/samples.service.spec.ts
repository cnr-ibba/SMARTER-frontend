import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SortDirection } from '@angular/material/sort';

import { environment } from '../../environments/environment';
import { SamplesService } from './samples.service';
import { SamplesSearch } from './samples.model';

describe('SamplesService', () => {
  let service: SamplesService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(SamplesService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Test for searching samples', () => {
    const pageIndex = 0;
    const pageSize = 10;
    const sortActive = '';
    const sortDirection: SortDirection = "desc";
    const samplesSearch: SamplesSearch = {
      breed: "Merino"
    };

    const expectedUrl = `${environment.backend_url}/samples/${service.selectedSpecie.toLowerCase()}?size=${pageSize}&breed=Merino`;

    service.getSamples(sortActive, sortDirection, pageIndex, pageSize, samplesSearch).subscribe(
      (samples) => {});

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  });

  it('Test for sample detail', () => {
    const _id = "test-sample"

    const expectedUrl = `${environment.backend_url}/samples/${service.selectedSpecie.toLowerCase()}/${_id}`;
    service.getSample(_id, "sheep").subscribe((sample => {}));

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  });
});
