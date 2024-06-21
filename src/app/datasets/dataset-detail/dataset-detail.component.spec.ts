import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DatasetDetailComponent } from './dataset-detail.component';
import { Dataset } from '../datasets.model';
import { SamplesComponent } from 'src/app/samples/samples.component';

const dataset: Dataset = {
  "_id": {
    "$oid": "604f75a61a08c53cebd09b58"
  },
  "breed": "2 Breeds",
  "country": "Italy",
  "file": "test_file.zip",
  "gene_array": "Plink text files",
  "n_of_individuals": 289,
  "partner": "Test",
  "size": "2MB",
  "species": "Sheep",
  "type": [
    "genotypes",
    "background"
  ],
  "uploader": "Test",
  "contents": [
    "archive/",
    "archive/test.map",
    "archive/test.ped"
  ],
  "chip_name": "IlluminaOvineSNP50"
};

const route = { data: of({ dataset: dataset }) };

describe('DatasetDetailComponent', () => {
  let component: DatasetDetailComponent;
  let fixture: ComponentFixture<DatasetDetailComponent>;
  let location: SpyLocation;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate') // Create a spy for the navigate method
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [{path: 'samples', component: SamplesComponent}]
        ),
        HttpClientTestingModule,
      ],
      declarations: [ DatasetDetailComponent ],
      // https://testing-angular.com/testing-components-with-children/#unit-test
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: Location, useClass: SpyLocation },
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetDetailComponent);
    component = fixture.componentInstance;
    location = <SpyLocation>TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get dataset data', () => {
    component.ngOnInit();
    expect(component.dataset).toEqual(dataset);
  });

  // https://codeutility.org/unit-testing-angular-6-location-go-back-stack-overflow/
  it('should go back to previous page on back button click', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should navigate to /samples with query params when getSamples is called', () => {
    component.getSamples();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/samples'],
      { queryParams: { dataset: component.dataset._id.$oid, species: component.dataset.species } }
    );
  });

});
