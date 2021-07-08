import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { UIService } from '../shared/ui.service';
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

  constructor(
    private http: HttpClient,
    private uiService: UIService,
  ) { }

  login(authData: AuthData) {
    // set loading state (required to show progress spinner during queries)
    this.uiService.loadingStateChanged.next(true);

    // sending the auth request
    this.http.post<AuthResponseData>(environment.backend_url + '/api/auth/login', authData)
      .subscribe(
        authResponseData => {
          const user = new User(authData.username, authResponseData.token);

          // emit user as a currently logged user
          this.user.next(user);
        }, (error: HttpErrorResponse) => {
          this.uiService.showSnackbar(error.error.message, "Dismiss");
        })

      this.uiService.loadingStateChanged.next(false);
  }

}
