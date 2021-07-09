import { AfterViewInit, Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Dataset } from './datasets.model';
import { DatasetsService } from './datasets.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['file', 'species', 'breed', 'country', 'type'];
  dataSource = new MatTableDataSource<Dataset>();

  constructor(private datasetsService: DatasetsService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.datasetsService.getDatasets().subscribe(responseData => {
      this.dataSource.data = responseData.items;
    }, error => {
      console.log(error);
    });
  }

}
