import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SampleDetailComponent } from './sample-detail.component';
import { Sample } from '../samples.model';

const sample: Sample = {
  "_id": {
    "$oid": "608ab4b191a0d06725bc0938"
  },
  "original_id": "sheep1",
  "smarter_id": "ITOA-TEX-000000001",
  "country": "Italy",
  "species": "Ovis aries",
  "breed": "Texel",
  "breed_code": "TEX",
  "dataset_id": {
    "$oid": "604f75a61a08c53cebd09b58"
  },
  "chip_name": "IlluminaOvineSNP50",
  "alias": "sheep-one",
  "type": "background",
  "phenotype": {},
  "metadata": {
    "biosample_id": "ABCDEF",
    "biosample_url": "http://test.com/ABCDEF"
  }
};

const route = { data: of({ sample: sample }) };

describe('SampleDetailComponent', () => {
  let component: SampleDetailComponent;
  let fixture: ComponentFixture<SampleDetailComponent>;
  let location: SpyLocation;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [ SampleDetailComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      // https://stackoverflow.com/questions/60222623/angular-test-how-to-mock-activatedroute-data
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: Location, useClass: SpyLocation }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleDetailComponent);
    component = fixture.componentInstance;
    location = <SpyLocation>TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get sample data', () => {
      component.ngOnInit();
      expect(component.sample).toEqual(sample);
    });
  });

  // https://codeutility.org/unit-testing-angular-6-location-go-back-stack-overflow/
  it('should go back to previous page on back button click', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});
