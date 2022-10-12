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
  dataset = '';

  constructor(
    private samplesService: SamplesService,
    private uiService: UIService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
      if (params['dataset']) {
        this.dataset = params['dataset'];
      }
    });

    this.speciesControl = new FormControl(this.samplesService.selectedSpecie);

    this.samplesForm = new FormGroup({
      original_id: new FormControl(),
      smarter_id: new FormControl(),
      dataset: new FormControl(this.dataset),
      breed: new FormControl(),
      country: new FormControl(),
      breed_code: new FormControl(),
    });
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
      this.onReset()
      this.samplesService.selectedSpecie = this.speciesControl.value;
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
          this.dataset = this.samplesForm.value.dataset;

          return this.samplesService.getSamples(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              this.samplesForm.value)
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
    this.paginator.pageIndex = 0
    this.formChanged.next();
  }

  onReset(): void {
    this.samplesForm.reset();
    this.paginator.pageIndex = 0;
    this.formChanged.next();
  }

  getQueryParams(): Object {
    interface QueryParams {
      page?: number;
      size?: number;
      sort?: string;
      order?: string;
      dataset?: string;
    }

    let queryParams: QueryParams = {};

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

    if (this.samplesForm.value.dataset) {
      queryParams['dataset'] = this.samplesForm.value.dataset;
    }

    return queryParams;
  }

  ngOnDestroy() {
    this.sortSubscription.unsubscribe();
    this.mergeSubscription.unsubscribe();
    this.speciesSubscription.unsubscribe();
  }

}
