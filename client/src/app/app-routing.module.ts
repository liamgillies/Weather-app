import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {WeatherCardTodayComponent} from './weather-card-today/weather-card-today.component';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {UnsubscribeComponent} from './unsubscribe/unsubscribe.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'today', component: WeatherCardTodayComponent},
  {path: 'subscribe', component: SubscribeComponent},
  {path: 'unsubscribe/:id', component: UnsubscribeComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
