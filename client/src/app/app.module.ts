import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LocationComponent } from './location/location.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { WeatherCardTodayComponent } from './weather-card-today/weather-card-today.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { SubscribeComponent } from './subscribe/subscribe.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    LocationComponent,
    LandingComponent,
    NavbarComponent,
    WeatherCardTodayComponent,
    SubscribeComponent,
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    CommonModule,
    Nl2BrPipeModule,
    MatProgressSpinnerModule
  ],
  providers: [Nl2BrPipeModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
