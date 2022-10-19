import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { of as observableOf, merge, Subject, Subscription } from 'rxjs';
import { catchError, switchMap, map, startWith, delay } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Variant } from './../variants.model';
import { VariantsService } from '../variants.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-variants-species',
  templateUrl: './variants-species.component.html',
  styleUrls: ['./variants-species.component.scss']
})
export class VariantsSpeciesComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  displayedColumns = ['name', 'chrom', 'position', 'illumina_top'];
  dataSource = new MatTableDataSource<Variant>();
  private sortSubscription!: Subscription;
  private mergeSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultsLength = 0;
  isLoading = false;

  @Input() selectedSpecie = "Sheep";
  selectedIndex = 0;
  selectedAssembly = '';
  tabs: string[] = [];
  assemblyChanged = new Subject<void>();

  // track query params
  pageIndex = 0;
  pageSize = 10;
  sortActive = '';
  sortDirection: SortDirection = "desc";

  constructor(
    private variantsService: VariantsService,
    private uiService: UIService,
  ) { }

  ngOnInit(): void {
    this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    this.mergeSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.assemblyChanged
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

        return this.variantsService.getVariants(
            this.selectedSpecie,
            this.selectedAssembly,
            this.sortActive,
            this.sortDirection,
            this.pageIndex,
            this.pageSize)
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
    ).subscribe(data => {
      this.dataSource.data = data
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // triggered when selectedSpecie changes
    this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
    this.selectedAssembly = this.tabs[this.selectedIndex];
    this.assemblyChanged.next();
  }

  indexChanged(index: number): void {
    this.selectedIndex = index;
    this.paginator.pageIndex = 0;
    this.selectedAssembly = this.tabs[this.selectedIndex];
    this.assemblyChanged.next();
  }

  ngOnDestroy(): void {
    this.sortSubscription.unsubscribe();
    this.mergeSubscription.unsubscribe();
  }
}
