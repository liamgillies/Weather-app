import { Component, OnInit } from '@angular/core';
import {WeatherJSON} from '../_models/weather-json';
import {JsonReaderService} from '../_services/json-reader.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  styles: [
  ]
})

export class LandingComponent implements OnInit {
  public homeLinkEnabled = false;
  private element: HTMLElement;
  constructor(private jsonReaderService: JsonReaderService) { }
  ngOnInit(): void {
    this.element = document.getElementById('proceed') as HTMLElement;
  }

  // Gets the JSON for the user's location then loads next page
  getJSON(): void {
    this.jsonReaderService.getLocation().then(res => {
      this.jsonReaderService.getInitialJson(res).then(() => {
          this.homeLinkEnabled = true;
          this.element.click();
        }
      );
    });
  }
}
