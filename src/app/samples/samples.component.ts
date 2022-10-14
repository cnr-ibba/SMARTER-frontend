
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { catchError, delay, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { Sample, SamplesSearch } from './samples.model';
import { SamplesService } from './samples.service';
import { UIService } from '../shared/ui.service';


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

  constructor(
    private samplesService: SamplesService,
    private uiService: UIService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pageSize = this.samplesService.pageSize;
  }

  ngOnInit(): void {
    // get parameters from url
    this.route.queryParams.subscribe(params => {
      if (params['page']) {
        this.pageIndex = +params['page'];
      }
      if (params['size']) {
        this.pageSize = +params['size'];
      }
      if (params['sort']) {
        this.sortActive = params['sort'];
      }
      if (params['order']) {
        this.sortDirection = params['order'];
      }
      if (params['species']) {
        this.samplesService.selectedSpecie = params['species'];
      }
      if (params['smarter_id']) {
        this.samplesSearch.smarter_id = params['smarter_id'];
      }
      if (params['original_id']) {
        this.samplesSearch.original_id = params['original_id'];
      }
      if (params['dataset']) {
        this.samplesSearch.dataset = params['dataset'];
      }
      if (params['breed']) {
        this.samplesSearch.breed = params['breed'];
      }
      if (params['breed_code']) {
        this.samplesSearch.breed_code = params['breed_code'];
      }
      if (params['country']) {
        this.samplesSearch.country = params['country'];
      }
    });

    this.speciesControl = new FormControl(this.samplesService.selectedSpecie);

    this.samplesForm = new FormGroup({
      original_id: new FormControl(),
      smarter_id: new FormControl(),
      dataset: new FormControl(),
      breed: new FormControl(),
      breed_code: new FormControl(),
      country: new FormControl(),
    });

    this.samplesForm.patchValue(this.samplesSearch);
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
      this.paginator.pageIndex = 0;
      this.samplesService.selectedSpecie = this.speciesControl.value;
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
    interface QueryParams {
      page?: number;
      size?: number;
      sort?: string;
      order?: string;
      species?: string;
      smarter_id?: string;
      original_id?: string;
      dataset?: string;
      breed?: string;
      breed_code?: string;
      country?: string;
    }

    let queryParams: QueryParams = {};

    // this value is always defined
    queryParams['species'] = this.samplesService.selectedSpecie;

    if (this.pageIndex) {
      queryParams['page'] = this.pageIndex;
    }

    if (this.pageSize) {
      queryParams['size'] = this.pageSize;
    }

    if (this.sortActive) {
      queryParams['sort'] = this.sortActive;
    }

    if (this.sortDirection && this.sortActive) {
      queryParams['order'] = this.sortDirection;
    }

    if (this.samplesSearch.smarter_id) {
      queryParams['smarter_id'] = this.samplesSearch.smarter_id;
    }

    if (this.samplesSearch.original_id) {
      queryParams['original_id'] = this.samplesSearch.original_id;
    }

    if (this.samplesSearch.dataset) {
      queryParams['dataset'] = this.samplesSearch.dataset;
    }

    if (this.samplesSearch.breed) {
      queryParams['breed'] = this.samplesSearch.breed;
    }

    if (this.samplesSearch.breed_code) {
      queryParams['breed_code'] = this.samplesSearch.breed_code;
    }

    if (this.samplesSearch.country) {
      queryParams['country'] = this.samplesSearch.country;
    }

    return queryParams;
  }

  ngOnDestroy() {
    this.sortSubscription.unsubscribe();
    this.mergeSubscription.unsubscribe();
    this.speciesSubscription.unsubscribe();
  }

}
