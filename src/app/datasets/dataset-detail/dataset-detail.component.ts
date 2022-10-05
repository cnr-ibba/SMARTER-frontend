import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dataset } from '../datasets.model';
import { DatasetsService } from '../datasets.service';

@Component({
  selector: 'app-dataset-detail',
  templateUrl: './dataset-detail.component.html',
  styleUrls: ['./dataset-detail.component.scss']
})
export class DatasetDetailComponent implements OnInit {
  dataset!: Dataset;

  constructor(
    private route: ActivatedRoute,
    private datasetsService: DatasetsService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getDataset();
  }

  getDataset(): void {
    const _id = String(this.route.snapshot.paramMap.get('_id'));
    this.datasetsService.getDataset(_id)
      .subscribe({
        next: dataset => this.dataset = dataset,
        error: error => console.log(error)
      });
  }

  goBack(): void {
    this.location.back();
  }

}
