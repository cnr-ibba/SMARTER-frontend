import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UIService } from '../../shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#definite-assignment-assertions
  // tell TS that this property will be used as this, even if I don't assign a value here or in constructor
  loginForm!: FormGroup;
  isLoading = false;
  private loadingSubscription!: Subscription;
  redirectTo!: string;
  hide = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    // partially inspired from https://jasonwatmore.com/post/2016/12/08/angular-2-redirect-to-previous-url-after-login-with-auth-guard
    // get return url from route parameters or default to '/'
    this.redirectTo = this.route.snapshot.queryParams['next'] || '/';

    // subscribe to see when request are performed by the server
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.loginForm = new FormGroup({
      // same ways to define validators
      username: new FormControl('', {validators: [Validators.required]}),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    this.authService.login({
      // this is reactive approach
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      redirectTo: this.redirectTo
    });
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
