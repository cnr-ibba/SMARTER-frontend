
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MaterialModule } from '../material/material.module';
import { AuthService, AuthResponseData } from './auth.service';
import { AuthData } from './auth-data.model';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;

  let authData: AuthData = {
    username: 'test',
    password: 'test',
    redirectTo: "/"
  }
  let authResponse: AuthResponseData = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2NTY3MDMyNCwianRpIjoibWlhbyIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiI2MGU4MThlMWYyMzBiZjQ2OWMwODNiYjUiLCJuYmYiOjE2NjU2NzAzMjQsImV4cCI6MTY2NjI3NTEyNH0.UVrnF8Ss6sNGul5-Ab59L4vZQEziRAHAkQ_egGBhAcY',
    expires: new Date().toLocaleString()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ]),
        HttpClientTestingModule,
        MaterialModule,
      ],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test authentication', () => {
    service.user.subscribe(user => {
      if (user) {
        expect(user.username).toBe('test');
      }
    })

    const expectedUrl = `${environment.backend_url}/auth/login`;

    service.login(authData);
    const request = controller.expectOne(expectedUrl);

    // Answer the request so the Observable emits a value.
    request.flush(authResponse);
  });

  it('test logout', () => {
    // fake a login
    const expectedUrl = `${environment.backend_url}/auth/login`;
    service.login(authData);
    const request = controller.expectOne(expectedUrl);
    request.flush(authResponse);

    // do a logout
    service.logout();

    service.user.subscribe(user => {
      expect(user).toBeNull();
    });
  });
});
