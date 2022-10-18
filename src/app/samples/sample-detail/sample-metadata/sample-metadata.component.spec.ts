import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from 'src/app/material/material.module';
import { SampleMetadataComponent } from './sample-metadata.component';
import { JSONObject } from '../../samples.model';

const metadata: JSONObject = {
    "biosample_id": "ABCDEF",
    "biosample_url": "http://test.com/ABCDEF"
}

describe('SampleMetadataComponent', () => {
  let component: SampleMetadataComponent;
  let fixture: ComponentFixture<SampleMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule
      ],
      declarations: [ SampleMetadataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleMetadataComponent);
    component = fixture.componentInstance;

    // assign values to component
    component.metadata = metadata;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
