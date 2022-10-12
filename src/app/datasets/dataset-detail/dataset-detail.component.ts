import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Location } from '@angular/common';

import { Dataset } from '../datasets.model';

@Component({
  selector: 'app-dataset-detail',
  templateUrl: './dataset-detail.component.html',
  styleUrls: ['./dataset-detail.component.scss']
})
export class DatasetDetailComponent implements OnInit {
  dataset!: Dataset;
  panelOpenState = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: Data) => {
        this.dataset = data["dataset"];
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

}
