import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { ShortenPipe } from './shared/shorten.pipe';
import { BreedsComponent } from './breeds/breeds.component';
import { SamplesComponent } from './samples/samples.component';
import { DatasetDetailComponent } from './datasets/dataset-detail/dataset-detail.component';
import { ProgressSpinnerComponent } from './shared/progress-spinner/progress-spinner.component';
import { SampleDetailComponent } from './samples/sample-detail/sample-detail.component';
import { LocationsListPipe } from './shared/locations-list.pipe';
import { SexToStringPipe } from './shared/sex.pipe';
import { SampleMetadataComponent } from './samples/sample-detail/sample-metadata/sample-metadata.component';
import { VariantsComponent } from './variants/variants.component';
import { VariantDetailComponent } from './variants/variant-detail/variant-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    SidenavListComponent,
    DatasetsComponent,
    NotFoundComponent,
    ShortenPipe,
    BreedsComponent,
    SamplesComponent,
    DatasetDetailComponent,
    ProgressSpinnerComponent,
    SampleDetailComponent,
    LocationsListPipe,
    SexToStringPipe,
    SampleMetadataComponent,
    VariantsComponent,
    VariantDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      // required, even if it is the only interceptor defined
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
