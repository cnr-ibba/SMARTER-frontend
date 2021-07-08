import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  constructor(
    private http: HttpClient,
  ) { }

  getDatasets() {
    this.http.get(environment.backend_url + '/datasets')
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })
  }
}
