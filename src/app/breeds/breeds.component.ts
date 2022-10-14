import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Breed } from './breeds.model';
import { BreedsService } from './breeds.service';
import { UIService } from '../shared/ui.service';


@Component({
  selector: 'app-breeds',
  templateUrl: './breeds.component.html',
  styleUrls: ['./breeds.component.scss']
})
export class BreedsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'species', 'code', 'n_individuals'];
  dataSource = new MatTableDataSource<Breed>();
  private sortSubscription!: Subscription;
  private searchSubscription!: Subscription;
  private mergeSubscription!: Subscription;
  private speciesSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchBox') searchBox!: ElementRef;

  resultsLength = 0;
  isLoading = false;
  search$!: Observable<void>;
  speciesControl!: FormControl;

  // track query params
  pageIndex = 0;
  pageSize = 10;
  sortActive = '';
  sortDirection: SortDirection = "desc";
  searchValue = '';

  constructor(
    private breedsService: BreedsService,
    private uiService: UIService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pageSize = this.breedsService.pageSize;
  }

  ngOnInit() {
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
      if (params['search']) {
        this.searchValue = params['search'];
      }
    });

    this.speciesControl = new FormControl(this.breedsService.selectedSpecie);
  }

  ngAfterViewInit() {
    this.router.navigate(
      ["/breeds"],
      {
        queryParams: this.getQueryParams()
      }
    );

    // set initial value in search box
    this.searchBox.nativeElement.value = this.searchValue;

    this.search$ = fromEvent(this.searchBox.nativeElement, 'keyup').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // get value
      map((event: any) => {
        this.searchValue = event.target.value;
      })
    );

    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // the same applies when user start searching stuff
    this.searchSubscription = this.search$.subscribe(() => this.paginator.pageIndex = 0);

    // free searchBox text
    this.speciesSubscription = this.speciesControl.valueChanges.subscribe(() => {
      this.searchBox.nativeElement.value = '';
      this.paginator.pageIndex = 0;
      this.breedsService.selectedSpecie = this.speciesControl.value;
    });

    this.mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.search$, this.speciesControl.valueChanges)
      .pipe(
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

          return this.breedsService.getBreeds(
              this.sortActive,
              this.sortDirection,
              this.pageIndex,
              this.pageSize,
              this.searchValue)
            .pipe(catchError((error) => {
              console.log(error);
              this.uiService.showSnackbar("Error while fetching data. Please, try again later", "Dismiss");
              return observableOf(null)
            })
          );
        }),
        map(data => {
          this.router.navigate(
            ["/breeds"],
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

  ngOnDestroy() {
    this.sortSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
    this.mergeSubscription.unsubscribe();
    this.speciesSubscription.unsubscribe();
  }

  getQueryParams(): Object {
    interface QueryParams {
      page?: number;
      size?: number;
      sort?: string;
      order?: string;
      searchValue?: string;
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

    if (this.searchValue) {
      queryParams.searchValue = this.searchValue;
    }

    return queryParams;
  }

}
