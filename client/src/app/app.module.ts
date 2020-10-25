import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavbarComponent,
    WeatherCardTodayComponent,
    SubscribeComponent,
    UnsubscribeComponent,
    LoginComponent,
    RegisterComponent,
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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    Nl2BrPipeModule,
    CommonModule,
  ],
  providers: [Nl2BrPipeModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
