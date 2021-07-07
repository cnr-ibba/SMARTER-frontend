import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#definite-assignment-assertions
  // tell TS that this property will be used as this, even if I don't assign a value here or in constructor
  loginForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      // same ways to define validators
      username: new FormControl('', {validators: [Validators.required]}),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    console.log(this.loginForm);
  }

}