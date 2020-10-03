import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LocationComponent} from './location/location.component';
import {WeatherCardTodayComponent} from './weather-card-today/weather-card-today.component';
import {SubscribeComponent} from './subscribe/subscribe.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'home', component: LocationComponent},
  {path: 'today', component: WeatherCardTodayComponent},
  {path: 'subscribe', component: SubscribeComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
