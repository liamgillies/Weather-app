import { Component } from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {JsonReaderService} from './_services/json-reader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';
  public showNavbar = false;
  constructor(router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.showNavbar = event.url !== '/';
      }
    }
    );
  }
}
