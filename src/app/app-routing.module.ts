import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
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
  { path: 'about', component: AboutComponent },
  {
    path: 'breeds',
    component: BreedsComponent
  },
  {
    path: 'datasets',
    component: DatasetsComponent
  },
  {
    path: 'datasets/:_id',
    component: DatasetDetailComponent,
    resolve: { dataset: DatasetResolver }
  },
  {
    path: 'samples',
    component: SamplesComponent,
  },
  {
    path: 'samples/:species/:_id',
    component: SampleDetailComponent,
    resolve: { sample: SampleResolver }
  },
  {
    path: 'variants',
    component: VariantsComponent,
  },
  {
    path: 'variants/:species/:_id',
    component: VariantDetailComponent,
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
