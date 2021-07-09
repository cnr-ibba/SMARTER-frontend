import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  errorMessage!: string;
  private routerSubscription!: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // read data from route
    this.routerSubscription = this.route.data.subscribe(
      // subscribe to route changes
      (data: Data) => {
        this.errorMessage = data['message'];
      }
    )
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
