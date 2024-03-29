import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, merge, Subject, Subscription, Observable } from 'rxjs';
import { catchError, switchMap, map, startWith, delay } from 'rxjs/operators';

import { UIService } from '../shared/ui.service';
import { Variant, VariantsSearch } from './variants.model';
import { VariantsService } from './variants.service';
import { PaginationParams } from '../shared/shared.model';

interface QueryParams extends VariantsSearch, PaginationParams {
  species?: string;
  assembly?: string;
}

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
  private chipsStateSubscription!: Subscription;

  resultsLength = 0;
  isLoading = false;
  speciesControl!: FormControl;
  selectedSpecie = "Sheep";
  selectedIndex = 0;
  selectedAssembly = '';
  tabs: string[] = [];
  tableChanged = new Subject<void>();

  // control variants query parameters
  variantsForm!: FormGroup;
  formChanged = new Subject<void>();

  // track query params
  pageIndex = 0;
  pageSize = 10;
  sortActive = '';
  sortDirection: SortDirection = "";
  variantSearch: VariantsSearch = {};

  // used by autocomplete forms
  filteredChips!: Observable<string[]>;

  constructor(
    private variantsService: VariantsService,
    private uiService: UIService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pageSize = this.variantsService.pageSize;
  }

  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if (control.value.startsWith(" ") || control.value.endsWith(" ")) {
        return {"noWhiteSpaces": true};
      }
    }
    return null;
  }

  regionValidator(control: AbstractControl): ValidationErrors | null {
    const chrom_pattern = new RegExp('^[a-zA-Z0-9_]+$');
    const region_pattern = new RegExp('^[a-zA-Z0-9_]+:[0-9]+-[0-9]+$')

    if (control.value) {
      if (!chrom_pattern.test(control.value) && !region_pattern.test(control.value)) {
        return {"invalidRegion": true}
      }
    }
    return null;
  }

  ngOnInit(): void {
    // get parameters from url
    this.route.queryParams.subscribe((params: QueryParams) => {
      params['page'] ? this.pageIndex = +params['page'] : null;
      params['size'] ? this.pageSize = +params['size'] : null;
      params['sort'] ? this.sortActive = params['sort'] : null;
      params['order'] ? this.sortDirection = params['order'] : null;
      params['species'] ? this.selectedSpecie = params['species'] : null;
      params['name'] ? this.variantSearch.name = params['name'] : null;
      params['chip_name'] ? this.variantSearch.chip_name = params['chip_name'] : null;
      params['rs_id'] ? this.variantSearch.rs_id = params['rs_id'] : null;
      params['probeset_id'] ? this.variantSearch.probeset_id = params['probeset_id'] : null
      params['region'] ? this.variantSearch.region = params['region'] : null;

      if (params['assembly'] && params['species']) {
        let assemblies: String[] = this.variantsService.supportedAssemblies[params['species']];
        this.selectedIndex = assemblies.indexOf(params['assembly']);

        // deal with wrong assemblies with this species
        if (this.selectedIndex < 0) {
          this.selectedIndex = 0;
        }
      }
    });

    this.speciesControl = new FormControl(this.selectedSpecie);
    this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
    this.selectedAssembly = this.tabs[this.selectedIndex];

    this.variantsForm = new FormGroup({
      name: new FormControl(null, [this.noWhiteSpaceValidator]),
      region: new FormControl(null, [
        this.noWhiteSpaceValidator,
        this.regionValidator
      ]),
      chip_name: new FormControl(null, [this.noWhiteSpaceValidator]),
      rs_id: new FormControl(null, [this.noWhiteSpaceValidator]),
      probeset_id: new FormControl(null, [this.noWhiteSpaceValidator]),
    });
    this.variantsForm.patchValue(this.variantSearch);

    // get all supported chips
    this.variantsService.getSupportedChips(this.selectedSpecie);
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

      // reload chips
      this.variantsService.getSupportedChips(this.selectedSpecie);

      this.variantsForm.reset();
      this.variantSearch = this.variantsForm.value;

      this.tableChanged.next();

      this.router.navigate(
        ["/variants"],
        {
          queryParams: this.getQueryParams()
        }
      );
    });

    this.tableSubscription = merge(
      this.tableChanged,
      this.formChanged
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
            this.pageSize,
            this.variantSearch)
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

    // subscribe to see when request are performed by the server
    this.chipsStateSubscription = this.variantsService.chipsStateChanged.subscribe(() => {
      // filter chip names
      this.filteredChips = this.variantsForm.controls['chip_name'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterChips(value || '')),
      );
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

  onSubmit(): void {
    // copy form values into my private instance of SampleSearch
    this.variantSearch = this.variantsForm.value;
    this.pageIndex = 0
    this.formChanged.next();
  }

  onReset(): void {
    this.variantsForm.reset();
    this.variantSearch = this.variantsForm.value;
    this.pageIndex = 0;
    this.formChanged.next();
    this.router.navigate(
      ["/variants"],
      {
        queryParams: this.getQueryParams()
      }
    );
  }

  getQueryParams(): Object {
    let queryParams: QueryParams = {};

    // this value is always defined
    queryParams['species'] = this.selectedSpecie;

    // condition ? true_expression : false_expression
    this.pageIndex ? queryParams['page'] = this.pageIndex : null;
    this.sortActive ? queryParams['sort'] = this.sortActive : null;
    this.sortDirection && this.sortActive ? queryParams['order'] = this.sortDirection : null;
    this.variantSearch.name ? queryParams['name'] = this.variantSearch.name : null;
    this.variantSearch.chip_name ? queryParams['chip_name'] = this.variantSearch.chip_name : null;
    this.variantSearch.rs_id ? queryParams['rs_id'] = this.variantSearch.rs_id : null;
    this.variantSearch.probeset_id ? queryParams['probeset_id'] = this.variantSearch.probeset_id : null;
    this.variantSearch.region ? queryParams['region'] = this.variantSearch.region : null;
    this.selectedAssembly ? queryParams['assembly'] = this.selectedAssembly : null;

    return queryParams;
  }

  private _filterChips(value: string): string[] {
    // console.log(this.variantsService.supportedChips);
    // console.log(`value: '${value}'`)

    // remove WholeGenomeSequencing from suggested values
    const index = this.variantsService.supportedChips.indexOf("WholeGenomeSequencing", 0);

    if (index > -1) {
      this.variantsService.supportedChips.splice(index, 1);
    }

    const filterValue = value.toLowerCase();
    return this.variantsService.supportedChips.filter(chip => chip.toLowerCase().includes(filterValue)).sort();
  }

  ngOnDestroy(): void {
    this.speciesSubscription.unsubscribe();
    this.tableSubscription.unsubscribe();
    this.chipsStateSubscription.unsubscribe();
  }
}
