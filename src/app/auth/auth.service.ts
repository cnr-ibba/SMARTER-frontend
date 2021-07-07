import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { User } from './user.model';

// declared here and not exported: I don't need it outside this module
export interface AuthResponseData {
  token: string;
  expires: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // "Replays" or emits old values to new subscribers
  user = new ReplaySubject<User>();

  constructor(private http: HttpClient) { }

  login(authData: AuthData) {
    this.http.post<AuthResponseData>('http://localhost:27080/api/auth/login', authData)
      .subscribe(
        authResponseData => {
          const user = new User(authData.username, authResponseData.token);

          // emit user as a currently logged user
          this.user.next(user);
        }, error => {
          console.log(error);
        })
  }

}
