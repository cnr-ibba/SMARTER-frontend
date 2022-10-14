import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleMetadataComponent } from './sample-metadata.component';
import { Sample } from '../../samples.model';

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
}

describe('SampleMetadataComponent', () => {
  let component: SampleMetadataComponent;
  let fixture: ComponentFixture<SampleMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleMetadataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleMetadataComponent);
    component = fixture.componentInstance;

    // assign values to component
    component.sample = sample;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
