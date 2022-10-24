import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
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
  private tableSubscription!: Subscription;
  private speciesSubscription!: Subscription;

  resultsLength = 0;
  isLoading = false;
  speciesControl!: FormControl;
  selectedSpecie = "Sheep";
  selectedIndex = 0;
  selectedAssembly = '';
  tabs: string[] = [];
  tableChanged = new Subject<void>();

  // track query params
  pageIndex = 0;
  pageSize = 10;
  sortActive = '';
  sortDirection: SortDirection = "";

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

    // reset pagination and forms
    this.speciesSubscription = this.speciesControl.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.selectedSpecie = this.speciesControl.value;
      this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
      this.selectedAssembly = this.tabs[this.selectedIndex];
      this.tableChanged.next();

      this.router.navigate(
        ["/variants"],
        {
          queryParams: this.getQueryParams()
        }
      );
    });

    this.tableSubscription = merge(
      this.tableChanged
    ).pipe(
      startWith({}),
      // delay(0) is required to solve the ExpressionChangedAfterItHasBeenCheckedError:
      // Expression has changed after it was checked. See https://blog.angular-university.io/angular-debugging/
      delay(0),
      switchMap(() => {
        this.isLoading = true;

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
    this.pageIndex = 0;
    this.selectedAssembly = this.tabs[this.selectedIndex];
    this.tableChanged.next();
  }

  sortData(sort: Sort) {
    this.pageIndex = 0;

    // unset sortActive when no direction
    if (sort.direction == '') {
      this.sortActive = '';
    } else {
      this.sortActive = sort.active;
    }

    this.sortDirection = sort.direction;
    this.tableChanged.next();
  }

  pageData(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.tableChanged.next();
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
    this.tableSubscription.unsubscribe();
  }
}
