
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { MaterialModule } from '../material/material.module';
import { BreedsComponent } from './breeds.component';
import { BreedsService } from './breeds.service';

describe('BreedsComponent', () => {
  let component: BreedsComponent;
  let fixture: ComponentFixture<BreedsComponent>;
  let mockBreedsService: BreedsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
      ],
      declarations: [ BreedsComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ search: 'Merino', species: 'Goat' })
          }
        },
        // https://stackoverflow.com/a/71300205
        {
          provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
          useValue: { floatLabel: 'always' },
        },
      ],
      // https://testing-angular.com/testing-components-with-children/#unit-test
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();

    // injecting mocked service
    mockBreedsService = TestBed.inject(BreedsService);
    spyOn(mockBreedsService, 'getBreeds').and.returnValue(of());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.searchValue).toBe("Merino");
    expect(mockBreedsService.selectedSpecie).toBe("Goat");
  });
});
