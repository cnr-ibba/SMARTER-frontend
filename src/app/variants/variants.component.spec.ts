
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MaterialModule } from '../material/material.module';
import { VariantsComponent } from './variants.component';

describe('testing VariantsComponent', () => {
  let component: VariantsComponent;
  let fixture: ComponentFixture<VariantsComponent>;

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
        ReactiveFormsModule,
        MaterialModule,
      ],
      declarations: [ VariantsComponent ],
      providers: [{ provide: ActivatedRoute, useValue: { queryParams: paramsMock }}],
      // https://testing-angular.com/testing-components-with-children/#unit-test
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Tries to route to a page', async () => {
    const testEl = fixture.debugElement.query(By.css('h1'));
    expect(testEl.nativeElement.textContent.trim())
      .toEqual('Searching Goat SNPs in ARS1 assembly');
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
});
