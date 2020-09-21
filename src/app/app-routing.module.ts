import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LocationComponent} from './location/location.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  { path: '**', redirectTo: 'home' },
  {path: 'home', component: LocationComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
