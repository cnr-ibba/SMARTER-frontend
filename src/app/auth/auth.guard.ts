import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    // determine if a user is authenticated or not by watching user BehaviourSubject
    return this.authService.user.pipe(
      // take the latest user value and then unsusbscribe
      take(1),
      map(user => {
        // convert a value in a true boolean, or a null/underfined value in false
        const isAuth = !!user;

        if (isAuth) {
          return true;
        }

        // if not authenticated, redirect to login page
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
