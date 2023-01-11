import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Location } from '@angular/common';

import { Sample } from '../samples.model';

@Component({
  selector: 'app-sample-detail',
  templateUrl: './sample-detail.component.html',
  styleUrls: ['./sample-detail.component.scss']
})
export class SampleDetailComponent implements OnInit {
  sample!: Sample;
  panelMetadata = true;
  panelPhenotype = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: Data) => {
        this.sample = data["sample"];
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
