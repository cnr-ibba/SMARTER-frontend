
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

import { merge, of as observableOf, Subscription, Subject, Observable } from 'rxjs';
import { catchError, delay, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { Sample, SamplesSearch, Country } from './samples.model';
import { SamplesService } from './samples.service';
import { UIService } from '../shared/ui.service';
import { PaginationParams } from '../shared/shared.model';

interface QueryParams extends PaginationParams {
  species?: string;
  smarter_id?: string;
  original_id?: string;
  dataset?: string;
  breed?: string;
  breed_code?: string;
  country?: string;
}

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['smarter_id', 'original_id', 'breed', 'breed_code', 'country', 'species'];
  dataSource = new MatTableDataSource<Sample>();
  private sortSubscription!: Subscription;
  private mergeSubscription!: Subscription;
  private speciesSubscription!: Subscription;
  private countryStateSubscription!: Subscription;
  private breedStateSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultsLength = 0;
  isLoading = false;
  speciesControl!: FormControl;

  // control samples query parameters
  samplesForm!: FormGroup;
  formChanged = new Subject<void>();

  // track query params
  pageIndex = 0;
  pageSize = 10;
  sortActive = '';
  sortDirection: SortDirection = "desc";
  samplesSearch: SamplesSearch = {};

  // used by autocomplete forms
  filteredCountries!: Observable<string[]>;
  filteredBreeds!: Observable<string[]>;
  filteredCodes!: Observable<string[]>;

  constructor(
    private samplesService: SamplesService,
    private uiService: UIService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pageSize = this.samplesService.pageSize;
  }

  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if (control.value.startsWith(" ") || control.value.endsWith(" ")) {
        return {"noWhiteSpaces": true};
      }
    }
    return null;
  }

  ngOnInit(): void {
    // get parameters from url
    this.route.queryParams.subscribe((params: QueryParams) => {
      // condition ? true_expression : false_expression
      params['page'] ? this.pageIndex = +params['page'] : null;
      params['size'] ? this.pageSize = +params['size'] : null;
      params['sort'] ? this.sortActive = params['sort'] : null;
      params['order'] ? this.sortDirection = params['order'] : null;
      params['species'] ? this.samplesService.selectedSpecie = params['species'] : null;
      params['smarter_id'] ? this.samplesSearch.smarter_id = params['smarter_id'] : null;
      params['original_id'] ? this.samplesSearch.original_id = params['original_id'] : null;
      params['dataset'] ? this.samplesSearch.dataset = params['dataset'] : null;
      params['breed'] ? this.samplesSearch.breed = params['breed'] : null;
      params['breed_code'] ? this.samplesSearch.breed_code = params['breed_code'] : null;
      params['country'] ? this.samplesSearch.country = params['country'] : null;
    });

    this.speciesControl = new FormControl(this.samplesService.selectedSpecie);

    this.samplesForm = new FormGroup({
      original_id: new FormControl(null, [this.noWhiteSpaceValidator]),
      smarter_id: new FormControl(null, [this.noWhiteSpaceValidator]),
      dataset: new FormControl(null, [this.noWhiteSpaceValidator]),
      breed: new FormControl(null, [this.noWhiteSpaceValidator]),
      breed_code: new FormControl(null, [this.noWhiteSpaceValidator]),
      country: new FormControl(null, [this.noWhiteSpaceValidator]),
    });

    this.samplesForm.patchValue(this.samplesSearch);

    // get all countries and breeds
    this.samplesService.getCountries();
    this.samplesService.getBreeds();
  }

  ngAfterViewInit() {
    this.router.navigate(
      ["/samples"],
      {
        queryParams: this.getQueryParams()
      }
    );

    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // reset pagination and forms
    this.speciesSubscription = this.speciesControl.valueChanges.subscribe(() => {
      // reset specie in services
      this.samplesService.selectedSpecie = this.speciesControl.value;

      // reload countries and breeds
      this.samplesService.getCountries();
      this.samplesService.getBreeds();

      // reset page stuff and navigation
      this.paginator.pageIndex = 0;
      this.samplesForm.reset();
      this.samplesSearch = this.samplesForm.value;
      this.router.navigate(
        ["/samples"],
        {
          queryParams: this.getQueryParams()
        }
      );
    });

    this.mergeSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.speciesControl.valueChanges,
      this.formChanged
      ).pipe(
        startWith({}),
        // delay(0) is required to solve the ExpressionChangedAfterItHasBeenCheckedError:
        // Expression has changed after it was checked. See https://blog.angular-university.io/angular-debugging/
        delay(0),
        switchMap(() => {
          this.isLoading = true;

          // update values
          this.sortActive = this.sort.active;
          this.sortDirection = this.sort.direction;
          this.pageIndex = this.paginator.pageIndex;
          this.pageSize = this.paginator.pageSize;

          return this.samplesService.getSamples(
              this.sortActive,
              this.sortDirection,
              this.pageIndex,
              this.pageSize,
              this.samplesSearch)
            .pipe(catchError((error) => {
              console.log(error);
              this.uiService.showSnackbar("Error while fetching data. Please, try again later", "Dismiss");
              return observableOf(null)
            })
          );
        }),
        map(data => {
          this.router.navigate(
            ["/samples"],
            {
              queryParams: this.getQueryParams()
            }
          );

          // Flip flag to show that loading has finished.
          this.isLoading = false;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total;
          return data.items;
        })
      ).subscribe(data => this.dataSource.data = data);

    // subscribe to see when request are performed by the server
    this.countryStateSubscription = this.samplesService.countryStateChanged.subscribe(() => {
      this.filteredCountries = this.samplesForm.controls['country'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterCountry(value || '')),
      );
    });

    this.breedStateSubscription = this.samplesService.breedStateChanged.subscribe(() => {
      this.filteredBreeds = this.samplesForm.controls['breed'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterBreed(value || '')),
      );

      this.filteredCodes = this.samplesForm.controls['breed_code'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterCode(value || '')),
      );
    });
  }

  onSubmit() {
    // copy form values into my private instance of SampleSearch
    this.samplesSearch = this.samplesForm.value;
    this.paginator.pageIndex = 0
    this.formChanged.next();
  }

  onReset(): void {
    this.samplesForm.reset();
    this.samplesSearch = this.samplesForm.value;
    this.paginator.pageIndex = 0;
    this.formChanged.next();
    this.router.navigate(
      ["/samples"],
      {
        queryParams: this.getQueryParams()
      }
    );
  }

  getQueryParams(): Object {
    let queryParams: QueryParams = {};

    // this value is always defined
    queryParams['species'] = this.samplesService.selectedSpecie;

    // condition ? true_expression : false_expression
    this.pageIndex ? queryParams['page'] = this.pageIndex : null;
    this.sortActive ? queryParams['sort'] = this.sortActive : null;
    this.sortDirection && this.sortActive ? queryParams['order'] = this.sortDirection : null;
    this.samplesSearch.smarter_id ? queryParams['smarter_id'] = this.samplesSearch.smarter_id : null;
    this.samplesSearch.original_id ? queryParams['original_id'] = this.samplesSearch.original_id : null;
    this.samplesSearch.dataset ? queryParams['dataset'] = this.samplesSearch.dataset : null;
    this.samplesSearch.breed ? queryParams['breed'] = this.samplesSearch.breed : null;
    this.samplesSearch.breed_code ? queryParams['breed_code'] = this.samplesSearch.breed_code : null;
    this.samplesSearch.country ? queryParams['country'] = this.samplesSearch.country : null;

    return queryParams;
  }

  private _filterCountry(value: string): string[] {
    // console.log(this.samplesService.countries);
    const filterValue = value.toLowerCase();
    return this.samplesService.countries.filter(country => country.toLowerCase().includes(filterValue)).sort();
  }

  private _filterBreed(value: string): string[] {
    // console.log(this.samplesService.breeds);
    const filterValue = value.toLowerCase();
    return this.samplesService.breeds.filter(breed => breed.toLowerCase().includes(filterValue)).sort();
  }

  private _filterCode(value: string): string[] {
    // console.log(this.samplesService.breed_codes);
    const filterValue = value.toLowerCase();
    return this.samplesService.breed_codes.filter(code => code.toLowerCase().includes(filterValue)).sort();
  }

  ngOnDestroy() {
    this.sortSubscription.unsubscribe();
    this.mergeSubscription.unsubscribe();
    this.speciesSubscription.unsubscribe();
    this.countryStateSubscription.unsubscribe();
    this.breedStateSubscription.unsubscribe();
  }

}
