import {Component, OnInit} from '@angular/core';
import {JsonReaderService} from '../_services/json-reader.service';
import {WeatherJSON} from '../_models/weather-json';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styles: [
  ],
})
export class LocationComponent implements OnInit {
  public url = '';
  public weatherJSON: WeatherJSON;

  constructor(private jsonReaderService: JsonReaderService) {
  }

  ngOnInit(): void {
  }

  getURL(): void{
    this.jsonReaderService.getLocation().then(res => {
      this.url = res;
    });
  }

  getInitialJson(): void{
    this.jsonReaderService.getInitialJson(this.url).then((res: WeatherJSON) => {
      this.weatherJSON = res;
      console.log(this.weatherJSON.properties.relativeLocation.properties.city);
    });
    }

}
