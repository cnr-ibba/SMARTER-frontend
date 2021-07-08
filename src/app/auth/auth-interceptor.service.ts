import { Injectable } from '@angular/core';
import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

// don't provide interceptors in root, it needs a custom configuration in
// app.module 'providers' section
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.endsWith('auth/login')) {
      // during login, I don't have a user
      return next.handle(req);
    }

    // this will be executed for each request
    return this.authService.user.pipe(
      // take: subscribe to user subject, get N objects and then unsubscribe
      take(1),
      // take the results of the first subscribe and returns a new observable
      exhaustMap(user => {
        // during login, I don't have a token. So I need to return the unmodified request
        if (!user) {
          return next.handle(req);
        }

        // copy the request in a new object that I can modify
        const modifiedReq = req.clone({
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + user.token
          })
        });

        // now I will add a token to each requests
        return next.handle(modifiedReq);
      })
    );
  }
}
