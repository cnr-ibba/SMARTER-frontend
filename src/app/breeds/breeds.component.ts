import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';

import { fromEvent, merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Breed } from './breeds.model';
import { BreedsService } from './breeds.service';
import { UIService } from '../shared/ui.service';


@Component({
  selector: 'app-breeds',
  templateUrl: './breeds.component.html',
  styleUrls: ['./breeds.component.scss']
})
export class BreedsComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'species', 'code', 'n_individuals'];
  dataSource = new MatTableDataSource<Breed>();
  private sortSubscription!: Subscription;
  private searchSubscription!: Subscription;
  private mergeSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchBox') searchBox!: ElementRef;

  resultsLength = 0;
  isLoading = true;
  search$!: Observable<object>;

  constructor(
    private breedsService: BreedsService,
    private uiService: UIService,
  ) { }

  ngAfterViewInit() {
    this.search$ = fromEvent(this.searchBox.nativeElement, 'keyup').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // get value
      map((event: any) => {
        return { 'searchValue': event.target.value };
      })
    );

    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // the same applies when user start searching stuff
    this.searchSubscription = this.search$.subscribe(() => this.paginator.pageIndex = 0);

    this.mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.search$)
      .pipe(
        startWith({}),
        switchMap((inputData) => {
          // inputData could be any of the merged events (sort change, paginator, keyup)
          let searchValue = '';

          // test if inputData comes from search$ observable
          if ('searchValue' in inputData) {
            searchValue = inputData["searchValue"];
          }

          this.isLoading = true;
          return this.breedsService.getBreeds(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              searchValue)
            .pipe(catchError((error) => {
              console.log(error);
              this.uiService.showSnackbar("Error while fetching data. Please, try again later", "Dismiss");
              return observableOf(null)
            })
          );
        }),
        map(data => {
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
  }

}
