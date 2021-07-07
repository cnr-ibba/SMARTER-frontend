import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthData } from './auth-data.model';

// declared here and not exported: I don't need it outside this module
export interface AuthResponseData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(authData: AuthData) {
    this.http.post<AuthResponseData>('http://localhost:27080/api/auth/login', authData)
      .subscribe(authResponseData => {
        console.log(authResponseData.token);
      })
  }

}
