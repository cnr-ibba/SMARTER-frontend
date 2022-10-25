import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SortDirection } from '@angular/material/sort';

import { environment } from '../../environments/environment';
import { VariantsService } from './variants.service';
import { VariantsSearch } from './variants.model';


describe('VariantsService', () => {
  let service: VariantsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(VariantsService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Test for searching variants', () => {
    const pageIndex = 0;
    const pageSize = 10;
    const sortActive = '';
    const sortDirection: SortDirection = "desc";
    const species = "sheep";
    const assembly = "OAR3";
    const samplesSearch: VariantsSearch = {
      region: "1:1-50000"
    };

    const expectedUrl = `${environment.backend_url}/variants/${species}/${assembly}?size=${pageSize}&region=1:1-50000`;

    service.getVariants(species, assembly, sortActive, sortDirection, pageIndex, pageSize, samplesSearch).subscribe(
      (variants) => {});

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  });

  it('Test for variant detail', () => {
    const _id = "test-variant"
    const species = "sheep";

    const expectedUrl = `${environment.backend_url}/variants/${species}/${_id}`;
    service.getVariant(_id, "sheep").subscribe((variant => {}));

    const request = controller.expectOne(expectedUrl);
    controller.verify();
  });

});
