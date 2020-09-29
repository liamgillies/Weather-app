import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LocationComponent} from './location/location.component';
import {TodayComponent} from './today/today.component';
import {WeatherCardTodayComponent} from './weather-card-today/weather-card-today.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'home', component: LocationComponent},
  {path: 'today', component: TodayComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
