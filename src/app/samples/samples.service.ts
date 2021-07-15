import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';

import { environment } from 'src/environments/environment';

import { SamplesAPI } from './samples.model';

@Injectable({
  providedIn: 'root'
})
export class SamplesService {
  selectedSpecie = "Sheep";

  constructor(
    private http: HttpClient,
  ) { }

  getSamples(sort: string, order: SortDirection, page: number, size: number) {
    let params = new HttpParams();

    if (page) {
      // HttpParams object is immutable. Overwrite old value with new one
      params = params.append('page', page+1);
    }

    if (size) {
      params = params.append('size', size);
    }

    if (sort) {
      params = params.append('sort', sort);
      params = params.append('order', order);
    }

    return this.http.get<SamplesAPI>(
      // set URL with species
      environment.backend_url + '/samples/' + this.selectedSpecie.toLowerCase(), {
        params: params
      });
  }

}
