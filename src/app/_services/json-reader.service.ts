import { Injectable } from '@angular/core';
import {WeatherJSON} from '../_models/weather-json';
import {HourlyJSON} from '../_models/hourly-json';
import {SingleHour} from '../_models/single-hour';

@Injectable({
  providedIn: 'any'
})
export class JsonReaderService {
  public lat = 0;
  public long = 0;
  public weatherJSON: WeatherJSON;
  public hourlyJSON: HourlyJSON;
  public nextTwelveHours: SingleHour[] = [];
  public url = '';
  constructor() { }

  getLocation(): Promise<string> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.url = 'https://api.weather.gov/points/' +
            position.coords.latitude + ',' +
            position.coords.longitude;
          return resolve('https://api.weather.gov/points/' +
            position.coords.latitude + ',' +
            position.coords.longitude,
        ); }
        else{
          return reject('geo');
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
          });
      }
    });
  }

  getNextTwelveHours(): Promise<void> {
    this.nextTwelveHours = [];
    return new Promise( (resolve) => {
      for (let i = 1; i < 13; i++) {
        this.nextTwelveHours.push(this.hourlyJSON.properties.periods[i]);
      }
      resolve();
    });
  }

  getHighLow(): string {
    let min = this.hourlyJSON.properties.periods[0].temperature;
    let max = this.hourlyJSON.properties.periods[0].temperature;
    for (const ele of this.hourlyJSON.properties.periods){
      if (ele.temperature > max){
        max = ele.temperature;
      }
      if (ele.temperature < min){
        min = ele.temperature;
      }
      if (ele.startTime.substring(11, 13) === '00'){
        return 'Today will have a high of ' + max + '\n and a low of ' + min;
      }
    }
    return '';
  }
}
