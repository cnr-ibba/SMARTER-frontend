import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

import { SupportedChip, SupportedChipsAPI, Variant, VariantsAPI, VariantsSearch } from './variants.model';
import { Observable, Subject, forkJoin } from 'rxjs';
import { ObjectDate } from '../shared/shared.model';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  supportedAssemblies: {[species: string]: string[]} = {
    "Sheep": ["OAR3", "OAR4"],
    "Goat": ["ARS1", "CHI1"]
  }
  pageSize = 10;
  supportedChips: string[] = [];

  // notify that something has happened
  chipsStateChanged = new Subject<void>();

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

  getVariant(_id: string, species: string) {
    const url = environment.backend_url + '/variants/' + species + "/" + _id;
    return this.http.get<Variant>(url).pipe(
      map((variant: Variant) => {
        variant.locations.forEach((location) => {
          if (location.date) {
            location.date = new ObjectDate(location.date.$date);
          }
        });
        return variant;
      })
    );
  }

  getSupportedChips(species: string,): void {
    let params = new HttpParams()
      .set('species', species)
      .set('size', 25);

    // console.log("Getting chips for ", species);

    this.supportedChips = [];

    //make the first request
    this.http.get<SupportedChipsAPI>(
      environment.backend_url + '/supported-chips', {
        params: params
      }).subscribe(firstPage => {
        // console.log(`Got the firstPage: ${firstPage}`);

        // read first page items
        firstPage.items.forEach((chip: SupportedChip) => {
          this.supportedChips.push(chip.name);
        });

        // inform that a new page has been processed
        this.chipsStateChanged.next();

        // now create an array of observables
        let requests: Observable<SupportedChipsAPI>[] = [];

        // next create an HttpResponse observable for each page
        for (let index = 2; index <= firstPage.pages; index++) {
          params = params.set('page', index);
          requests.push(this.http.get<SupportedChipsAPI>( environment.backend_url + '/supported-chips', {params: params} ));
        }

        // now execute all the requests in parallel. Then subscribe
        forkJoin(requests).subscribe(results => {
          results.forEach((page: SupportedChipsAPI) => {
            // console.log(`Got another page: ${page}`);

            page.items.forEach((chip: SupportedChip) => {
              this.supportedChips.push(chip.name);
            })
          });

          // inform that a new page has been processed
          this.chipsStateChanged.next();
        });
      });
  }
}
