import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'datasets',
    component: DatasetsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    // pass custom data to NotFoundComponent
    data: { message: 'Sorry, this page doesn\'t exist...' }
  },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
