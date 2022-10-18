import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SamplesService } from '../samples/samples.service';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss']
})
export class VariantsComponent implements OnInit, AfterViewInit, OnDestroy {
  private speciesSubscription!: Subscription;
  speciesControl!: FormControl;

  constructor(
    private samplesService: SamplesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // get parameters from url
    this.route.queryParams.subscribe(params => {
      if (params['species']) {
        this.samplesService.selectedSpecie = params['species'];
      }
    });

    this.speciesControl = new FormControl(this.samplesService.selectedSpecie);
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
      this.samplesService.selectedSpecie = this.speciesControl.value;

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
    queryParams['species'] = this.samplesService.selectedSpecie;

    return queryParams;
  }

  ngOnDestroy(): void {
    this.speciesSubscription.unsubscribe();
  }
}
