import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Location } from '@angular/common';

import { Variant } from './../variants.model';

@Component({
  selector: 'app-variant-detail',
  templateUrl: './variant-detail.component.html',
  styleUrls: ['./variant-detail.component.scss']
})
export class VariantDetailComponent implements OnInit {
  variant!: Variant;
  panelProbesets = false;
  panelSequence = false;
  panelLocation = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: Data) => {
        this.variant = data["variant"];
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
