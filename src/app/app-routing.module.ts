import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { DatasetDetailComponent } from './datasets/dataset-detail/dataset-detail.component';
import { DatasetResolver } from './datasets/dataset-detail/dataset-resolver.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { BreedsComponent } from './breeds/breeds.component';
import { SamplesComponent } from './samples/samples.component';
import { SampleDetailComponent } from './samples/sample-detail/sample-detail.component';
import { SampleResolver } from './samples/sample-detail/sample-resolver.service';
import { VariantsComponent } from './variants/variants.component';
import { VariantDetailComponent } from './variants/variant-detail/variant-detail.component';
import { VariantResolver } from './variants/variant-detail/variant-resolver.service';


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
    canActivate: [ AuthGuard ],
    resolve: { dataset: DatasetResolver }
  },
  {
    path: 'samples',
    component: SamplesComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'samples/:species/:_id',
    component: SampleDetailComponent,
    canActivate: [ AuthGuard ],
    resolve: { sample: SampleResolver }
  },
  {
    path: 'variants',
    component: VariantsComponent,
    canActivate: [ AuthGuard ],
  },
  {
    path: 'variants/:species/:_id',
    component: VariantDetailComponent,
    canActivate: [ AuthGuard ],
    resolve: { variant: VariantResolver }
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
