import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { DatasetDetailComponent } from './datasets/dataset-detail/dataset-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BreedsComponent } from './breeds/breeds.component';
import { SamplesComponent } from './samples/samples.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'breeds',
    component: BreedsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'datasets',
    component: DatasetsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'datasets/:_id',
    component: DatasetDetailComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'samples',
    component: SamplesComponent,
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
