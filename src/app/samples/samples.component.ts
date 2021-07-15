import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Sample } from './samples.model';
import { SamplesService } from './samples.service';
import { UIService } from '../shared/ui.service';


@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['original_id', 'smarter_id', 'breed', 'breed_code', 'country', 'species'];
  dataSource = new MatTableDataSource<Sample>();
  private sortSubscription!: Subscription;
  private mergeSubscription!: Subscription;
  private speciesSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultsLength = 0;
  isLoading = true;
  speciesControl!: FormControl;

  constructor(
    private samplesService: SamplesService,
    private uiService: UIService,
  ) { }

  ngOnInit(): void {
    this.speciesControl = new FormControl(this.samplesService.selectedSpecie);
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // free searchBox text
    this.speciesSubscription = this.speciesControl.valueChanges.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.samplesService.selectedSpecie = this.speciesControl.value;
    });

    this.mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.speciesControl.valueChanges)
      .pipe(
        startWith({}),
        switchMap((inputData) => {
          this.isLoading = true;
          return this.samplesService.getSamples(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize)
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
    this.mergeSubscription.unsubscribe();
    this.speciesSubscription.unsubscribe();
  }

}
