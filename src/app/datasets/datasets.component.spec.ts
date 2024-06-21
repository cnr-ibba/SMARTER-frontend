import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/operators';

import { MaterialModule } from '../material/material.module';
import { DatasetsComponent } from './datasets.component';
import { DatasetsService } from './datasets.service';

describe('DatasetsComponent', () => {
  let component: DatasetsComponent;
  let fixture: ComponentFixture<DatasetsComponent>;
  let datasetsService: DatasetsService;
  let router: Router;

  // Creates an observable that will be used for testing ActivatedRoute params
  const paramsMock = new Observable((observer) => {
    observer.next({
      page: 1,
      size: 5,
      sort: 'name',
      order: 'desc',
      search: null
    });
    observer.complete();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'datasets', component: DatasetsComponent}]
        ),
        MaterialModule,
      ],
      declarations: [ DatasetsComponent ],
      providers: [
        { provide: DatasetsService, useValue: { getDatasets: () => of([]) } },
        { provide: ActivatedRoute, useValue: { queryParams: paramsMock }}
      ],
      // https://testing-angular.com/testing-components-with-children/#unit-test
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    fixture = TestBed.createComponent(DatasetsComponent);
    component = fixture.componentInstance;
    datasetsService = TestBed.inject(DatasetsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct columns', () => {
    expect(component.displayedColumns).toEqual(['file', 'species', 'breed', 'country', 'type']);
  });

  it('should call getDatasets on init', fakeAsync(() => {
    spyOn(datasetsService, 'getDatasets').and.callThrough();
    component.ngAfterViewInit();
    tick(1);
    expect(datasetsService.getDatasets).toHaveBeenCalled();
  }));

  it('should update searchValue and navigate to /datasets with query params', () => {
    const event = { target: { value: 'test' } };
    const queryParams = component.getQueryParams();

    of(event).pipe(
      map((event: any) => {
        component.searchValue = event.target.value;
        router.navigate(
          ["/datasets"],
          {
            queryParams: queryParams
          }
        )
      })
    ).subscribe();

    expect(component.searchValue).toBe('test');
    expect(router.navigate).toHaveBeenCalledWith(['/datasets'], { queryParams: queryParams });
  });
});
