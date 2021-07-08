import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { exhaustMap, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getDatasets() {
    this.authService.user.pipe(
      // don't watch user Observable, take only one value
      take(1),
      // wait for the previous observable to complete, then replace it
      exhaustMap(user => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + user.token
          })
        };

        return this.http.get(environment.backend_url + '/datasets', httpOptions);
      })
    )
    .subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }
}
