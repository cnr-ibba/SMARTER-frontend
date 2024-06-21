import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SortDirection } from '@angular/material/sort';

import { environment } from '../../environments/environment';
import { SamplesService } from './samples.service';
import { CountriesAPI, SamplesSearch } from './samples.model';
import countriesData from './countries-example.json';

describe('SamplesService', () => {
  let service: SamplesService;
  let controller: HttpTestingController;
  let mockCountries: CountriesAPI = countriesData;

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
    const pageIndex = 1;
    const pageSize = 2;
    const sortActive = 'sample_id';
    const sortDirection: SortDirection = "desc";
    const samplesSearch: SamplesSearch = {
      breed: "Merino"
    };

    const expectedUrl = `${environment.backend_url}/samples/${service.selectedSpecie.toLowerCase()}?page=2&size=2&sort=sample_id&order=desc&breed=Merino`;

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

  it('Test getting all countries', () => {
    const expectedUrl = `${environment.backend_url}/countries?species=${service.selectedSpecie}&size=25`;
    service.getCountries();

    const request = controller.expectOne(expectedUrl);
    request.flush(mockCountries);
    expect(service.countries.length).toBe(mockCountries.total)
    controller.verify();
  });

  it('Test getting all breeds', () => {
    const expectedUrl = `${environment.backend_url}/breeds?species=${service.selectedSpecie}&size=25`;
    service.getBreeds();

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  })
});
