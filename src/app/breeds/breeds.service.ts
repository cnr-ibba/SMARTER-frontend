import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';

import { environment } from '../../environments/environment';

import { BreedsAPI } from './breeds.model';

@Injectable({
  providedIn: 'root'
})
export class BreedsService {
  constructor(
    private http: HttpClient,
  ) { }

  getBreeds(sort: string, order: SortDirection, page: number, size: number, searchValue: string) {
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

    if (searchValue) {
      params = params.append('search', searchValue);
    }

    return this.http.get<BreedsAPI>(
      environment.backend_url + '/breeds', {
        params: params
      });
  }

}
