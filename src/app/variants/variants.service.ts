import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

import { VariantsAPI, VariantsSearch } from './variants.model';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  supportedAssemblies: {[species: string]: string[]} = {
    "Sheep": ["OAR3", "OAR4"],
    "Goat": ["ARS1", "CHI1"]
  }
  pageSize = 10;

  constructor(
    private http: HttpClient,
  ) { }

  getVariants(
      species: string,
      assembly: string,
      sort?: string,
      order: SortDirection = "desc",
      page?: number,
      size?: number,
      search?: VariantsSearch
  ) {
    let params = new HttpParams();

    if (page) {
      // HttpParams object is immutable. Overwrite old value with new one
      params = params.append('page', page+1);
    }

    if (size) {
      params = params.append('size', size);
      this.pageSize = size;
    }

    if (sort) {
      params = params.append('sort', sort);
      params = params.append('order', order);
    }

    if (search) {
      // iterate over object values
      for (const [key, value] of Object.entries(search)) {
        // value could be null
        if (value) {
          params = params.append(key, value);
        }
      }
    }

    return this.http.get<VariantsAPI>(
      // set URL with variants
      `${environment.backend_url}/variants/${species.toLowerCase()}/${assembly.toUpperCase()}`, {
        params: params
      });
    }
}
