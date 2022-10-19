import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, merge, Subject, Subscription } from 'rxjs';
import { catchError, switchMap, map, startWith, delay } from 'rxjs/operators';

import { UIService } from '../shared/ui.service';
import { Variant } from './variants.model';
import { VariantsService } from './variants.service';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss']
})
export class VariantsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'chrom', 'position', 'illumina_top'];
  dataSource = new MatTableDataSource<Variant>();
  private sortSubscription!: Subscription;
  private mergeSubscription!: Subscription;
  private speciesSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultsLength = 0;
  isLoading = false;
  speciesControl!: FormControl;
  selectedSpecie = "Sheep";
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
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pageSize = this.variantsService.pageSize;
  }

  ngOnInit(): void {
    // get parameters from url
    this.route.queryParams.subscribe(params => {
      if (params['species']) {
        this.selectedSpecie = params['species'];
      }
    });

    this.speciesControl = new FormControl(this.selectedSpecie);
    this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
    this.selectedAssembly = this.tabs[this.selectedIndex];
  }

  ngAfterViewInit(): void {
    this.router.navigate(
      ["/variants"],
      {
        queryParams: this.getQueryParams()
      }
    );

    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    // reset pagination and forms
    this.speciesSubscription = this.speciesControl.valueChanges.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.selectedSpecie = this.speciesControl.value;
      this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
      this.selectedAssembly = this.tabs[this.selectedIndex];
      this.assemblyChanged.next();

      this.router.navigate(
        ["/variants"],
        {
          queryParams: this.getQueryParams()
        }
      );
    });

    this.mergeSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.assemblyChanged,
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
        this.router.navigate(
          ["/variants"],
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
    ).subscribe(data => {
      this.dataSource.data = data
    });
  }

  tabChanged(index: number): void {
    this.selectedIndex = index;
    this.paginator.pageIndex = 0;
    this.selectedAssembly = this.tabs[this.selectedIndex];
    this.assemblyChanged.next();
  }

  getQueryParams(): Object {
    interface QueryParams {
      species?: string;
    }

    let queryParams: QueryParams = {};

    // this value is always defined
    queryParams['species'] = this.selectedSpecie;

    return queryParams;
  }

  ngOnDestroy(): void {
    this.speciesSubscription.unsubscribe();
    this.sortSubscription.unsubscribe();
    this.mergeSubscription.unsubscribe();
  }
}
