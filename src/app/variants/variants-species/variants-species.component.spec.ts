import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../../material/material.module';
import { VariantsSpeciesComponent } from './variants-species.component';

describe('VariantsSpeciesComponent', () => {
  let component: VariantsSpeciesComponent;
  let fixture: ComponentFixture<VariantsSpeciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
      ],
      declarations: [ VariantsSpeciesComponent ],
      // https://testing-angular.com/testing-components-with-children/#unit-test
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantsSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
