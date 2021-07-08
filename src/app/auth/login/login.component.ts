import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private authService: AuthService,
    private uiService: UIService
  ) { }

  ngOnInit(): void {
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
      password: this.loginForm.value.password
    });
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
