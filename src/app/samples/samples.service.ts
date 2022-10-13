
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';

import { environment } from 'src/environments/environment';

import { Sample, SamplesAPI, SamplesSearch, CountriesAPI, Country } from './samples.model';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SamplesService {
  selectedSpecie = "Sheep";
  countries: Country[] = [];
  pageSize = 10;

  constructor(
    private http: HttpClient,
  ) { }

  getSamples(sort: string, order: SortDirection, page: number, size: number, search?: SamplesSearch) {
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

    return this.http.get<SamplesAPI>(
      // set URL with species
      environment.backend_url + '/samples/' + this.selectedSpecie.toLowerCase(), {
        params: params
      });
  }

  getCountries(): void {
    let params = new HttpParams().set('species', this.selectedSpecie);

    //make the first request
    this.http.get<CountriesAPI>(
      environment.backend_url + '/countries', {
        params: params
      }).subscribe(firstPage => {
        // read first page items
        firstPage.items.forEach((country: Country) => {
          this.countries.push(country);
        });

        // now create an array of observables
        let requests: Observable<CountriesAPI>[] = [];

        // next create an HttpResponse observable for each page
        for (let index = 2; index <= firstPage.pages; index++) {
          params = params.set('page', index);
          requests.push(this.http.get<CountriesAPI>( environment.backend_url + '/countries', {params: params}));
        }

        // now execute all the requests in parallel. Then subscribe
        forkJoin(requests).subscribe(results => {
          results.forEach((page: CountriesAPI) => {
            page.items.forEach((country: Country) => {
              this.countries.push(country);
            })
          })
        });
      });
  }

  getSample(_id: string, species: string) {
    const url = environment.backend_url + '/samples/' + species + "/" + _id;
    return this.http.get<Sample>(url);
  }
}
