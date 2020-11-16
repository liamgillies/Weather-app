import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import {WeatherCardTodayComponent} from './weather-card-today/weather-card-today.component';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {UnsubscribeComponent} from './unsubscribe/unsubscribe.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {SavedlocationsComponent} from './savedlocations/savedlocations.component';
import {AnalyticsComponent} from './analytics/analytics.component';
import {AboutComponent} from './about/about.component';

const routes: Routes = [
  {path: 'about', component: AboutComponent},
  {path: 'today', component: WeatherCardTodayComponent},
  {path: 'subscribe', component: SubscribeComponent},
  {path: 'unsubscribe/:id', component: UnsubscribeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'saved', component: SavedlocationsComponent},
  {path: 'analytics', component: AnalyticsComponent},
  {path: '**', component: WeatherCardTodayComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
