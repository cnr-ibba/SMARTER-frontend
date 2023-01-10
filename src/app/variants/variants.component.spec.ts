
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { delay, Observable, of } from 'rxjs';

import { MaterialModule } from '../material/material.module';
import { VariantsComponent } from './variants.component';
import { VariantsAPI } from './variants.model';
import { VariantsService } from './variants.service';
import variantsData from './variants-example.json';

describe('testing VariantsComponent', () => {
  let component: VariantsComponent;
  let fixture: ComponentFixture<VariantsComponent>;
  let variantsService: VariantsService;
  let variants: VariantsAPI = variantsData;

  // Creates an observable that will be used for testing ActivatedRoute params
  const paramsMock = new Observable((observer) => {
    observer.next({
      species: 'Goat',
      page: 1,
      size: 5,
      sort: 'name',
      order: 'desc',
      name: 'foo',
      chip_name: 'bar',
      rs_id: 'baz',
      probeset_id: 'cippa',
      region: '1:1-10000'
    });
    observer.complete();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'variants', component: VariantsComponent}]
        ),
        ReactiveFormsModule,
        MaterialModule,
      ],
      declarations: [ VariantsComponent ],
      providers: [
        VariantsService,
        { provide: ActivatedRoute, useValue: { queryParams: paramsMock }}
      ],
      // https://testing-angular.com/testing-components-with-children/#unit-test
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantsComponent);
    component = fixture.componentInstance;
    variantsService = TestBed.inject(VariantsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test noWhiteSpaceValidator with invalid input', () => {
    const whiteInput = " test";

    component.variantsForm.patchValue({
      ['name']: whiteInput,
      ['region']: whiteInput,
      ['chip_name']: whiteInput,
      ['rs_id']: whiteInput,
      ['probeset_id']: whiteInput
    })

    expect(component.variantsForm.get(["name"])?.hasError("noWhiteSpaces")).toBe(true);
    expect(component.variantsForm.get(["region"])?.hasError("noWhiteSpaces")).toBe(true);
    expect(component.variantsForm.get(["chip_name"])?.hasError("noWhiteSpaces")).toBe(true);
    expect(component.variantsForm.get(["rs_id"])?.hasError("noWhiteSpaces")).toBe(true);
    expect(component.variantsForm.get(["probeset_id"])?.hasError("noWhiteSpaces")).toBe(true);
  });

  it('Test regionValidator with valid input', () => {
    component.variantsForm.patchValue({
      ['region']: "1"
    })

    expect(component.variantsForm.get(["region"])?.valid).toBe(true);

    component.variantsForm.patchValue({
      ['region']: "1:1-10000"
    })

    expect(component.variantsForm.get(["region"])?.valid).toBe(true);
  });

  it('Test regionValidator with invalid input', () => {
    component.variantsForm.patchValue({
      ['region']: "1:1"
    })

    expect(component.variantsForm.get(["region"])?.hasError("invalidRegion")).toBe(true);
  });

  it('On init variants should be loaded', fakeAsync(() => {
    // create a new component in order to call spyOn
    fixture = TestBed.createComponent(VariantsComponent);
    component = fixture.componentInstance;

    spyOn(variantsService, 'getVariants').and.returnValue(of(variants).pipe(delay(1)));

    // now detecting changes
    fixture.detectChanges();

    expect(variantsService.getVariants).not.toHaveBeenCalled();
    expect(component.resultsLength).toBe(0);

    // Simulates the asynchronous passage of time
    tick(1);

    expect(variantsService.getVariants).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
    expect(component.resultsLength).toBe(1);
  }));

  it('Tries to route to a page', async () => {
    const testEl = fixture.debugElement.query(By.css('h1'));
    expect(testEl.nativeElement.textContent.trim())
      .toEqual('Searching Goat SNPs in ARS1 assembly');
  });

});
