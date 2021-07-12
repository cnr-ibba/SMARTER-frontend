import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Dataset } from './datasets.model';
import { DatasetsService } from './datasets.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['file', 'species', 'breed', 'country', 'type'];
  dataSource = new MatTableDataSource<Dataset>();
  private sortSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultsLength = 0;
  isLoadingResults = true;

  constructor(private datasetsService: DatasetsService) { }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.datasetsService.getDatasets(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize)
            .pipe(catchError((error) => {
              console.error(error);
              return observableOf(null)
            })
          );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

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
  }

}
