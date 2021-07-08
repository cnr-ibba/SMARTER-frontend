import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

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
  // A variant of Subject that requires an initial value and emits its current
  // value whenever it is subscribed to. A normal Subject is optimal
  // to see status changes, like when user login and logout since UI need to change
  // immediately. However, I need a user to do my request, so I need this value
  // even after I made the subscription (for instance, when fetching data after
  // login)
  user = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private uiService: UIService,
    private router: Router,
  ) { }

  login(authData: AuthData) {
    // set loading state (required to show progress spinner during queries)
    this.uiService.loadingStateChanged.next(true);

    // sending the auth request
    this.http.post<AuthResponseData>(environment.backend_url + '/auth/login', authData)
      .subscribe(
        authResponseData => {
          // create a new user object
          const user = new User(authData.username, authResponseData.token);

          // emit user as a currently logged user
          this.user.next(user);

          /* we need also to save data somewhere since when I reload the page, the application
          start a new instance and so all the data I have (ie, the token) is lost. I can
          use localStorage which is a persistent location on the browser which can store
          key->value pairs. 'userData' is the key. The value can't be a JS object, need to
          be converted as a string with JSON.stringify method, which can serialize a JS object */
          localStorage.setItem('userData', JSON.stringify(user));

          // redirect to home page
          this.router.navigate(["/"])
        }, (error: HttpErrorResponse) => {
          this.uiService.showSnackbar(error.error.message, "Dismiss");
        })

      this.uiService.loadingStateChanged.next(false);
  }

  /* when application starts (or is reloaded), search for userData saved in localStorage
  an try to setUp a user object */
  autoLogin() {
    const userData: {
      username: string;
      _token: string;
      _tokenExpirationDate: string;
    // https://stackoverflow.com/a/46915314/4385116
    // JSON.parse need a string as an argument
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) {
      // no user data: you must sign in
      return;
    }

    const loadedUser = new User(
      userData.username,
      userData._token
    );

    // check token validity. token property is a getter method, which returns
    // null if token is expired. So:
    if (loadedUser.token) {
      // emit loaded user with our subject
      this.user.next(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(["/login"]);

    // if I logout, I need to clear out the localStorage from user data, since
    // the token won't be valid forever
    localStorage.removeItem('userData');
  }
}
