import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { DatasetsAPI } from './datasets.model';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {
  constructor(
    private http: HttpClient,
  ) { }

  getDatasets() {
    return this.http.get<DatasetsAPI>(environment.backend_url + '/datasets');
  }
}
