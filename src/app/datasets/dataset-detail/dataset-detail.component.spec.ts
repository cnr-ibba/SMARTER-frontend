import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DatasetDetailComponent } from './dataset-detail.component';
import { Dataset } from '../datasets.model';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [ DatasetDetailComponent ],
      // https://testing-angular.com/testing-components-with-children/#unit-test
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get dataset data', () => {
      component.ngOnInit();
      expect(component.dataset).toEqual(dataset);
    });
  });
});
