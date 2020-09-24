import { Injectable } from '@angular/core';
import {WeatherJSON} from '../_models/weather-json';
import {HourlyJSON} from '../_models/hourly-json';

@Injectable({
  providedIn: 'any'
})
export class JsonReaderService {
  public lat = 0;
  public long = 0;
  public weatherJSON: WeatherJSON;
  public hourlyJSON: HourlyJSON;
  constructor() { }

  getLocation(): Promise<string> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          return resolve('https://api.weather.gov/points/' +
            position.coords.latitude + ',' +
            position.coords.longitude,
        ); }
        else{
          return reject('');
        }
      });
    });
  }

  getInitialJson(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (url === '') {
        reject('Location not fetched');
      } else {
        fetch(url)
          .then(res => res.json())
          .then(out => {
            resolve(this.weatherJSON = out);
          });
      }
    });
  }

  getHourly(json: WeatherJSON): Promise<void>{
    return new Promise((resolve, reject) => {
      if (!json) {
        reject('Weather JSON not fetched');
      } else {
        fetch(json.properties.forecastHourly)
          .then(res => res.json())
          .then(out => {
            resolve(this.hourlyJSON = out);
            console.log(this.hourlyJSON);
          });
      }
    });
  }
}
