import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss']
})
export class VariantsComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedSpecie = "Sheep";
  private speciesSubscription!: Subscription;
  speciesControl!: FormControl;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // get parameters from url
    this.route.queryParams.subscribe(params => {
      if (params['species']) {
        this.selectedSpecie = params['species'];
      }
    });

    this.speciesControl = new FormControl(this.selectedSpecie);
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
      this.selectedSpecie = this.speciesControl.value;

      this.router.navigate(
        ["/variants"],
        {
          queryParams: this.getQueryParams()
        }
      );
    });
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
  }
}
