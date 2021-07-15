import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  isLoading = true;
  search$!: Observable<object>;
  speciesControl!: FormControl;

  constructor(
    private breedsService: BreedsService,
    private uiService: UIService,
  ) { }

  ngOnInit() {
    this.speciesControl = new FormControl(this.breedsService.selectedSpecie);
  }

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

    // free searchBox text
    this.speciesSubscription = this.speciesControl.valueChanges.subscribe(() => {
      this.searchBox.nativeElement.value = '';
      this.paginator.pageIndex = 0;
      this.breedsService.selectedSpecie = this.speciesControl.value;
    });

    this.mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.search$, this.speciesControl.valueChanges)
      .pipe(
        startWith({}),
        switchMap((inputData) => {
          this.isLoading = true;
          return this.breedsService.getBreeds(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              inputData?.searchValue)
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
    this.speciesSubscription.unsubscribe();
  }

}
