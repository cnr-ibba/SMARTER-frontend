import { Component, OnInit } from '@angular/core';
import { DatasetsService } from './datasets.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {

  constructor(private datasetsService: DatasetsService) { }

  ngOnInit(): void {
  }

  onFetchDataset() {
    this.datasetsService.getDatasets();
  }

}
