import { Injectable } from '@angular/core';
import {WeatherJSON} from '../_models/weather-json';
import {HourlyJSON} from '../_models/hourly-json';
import {SingleHour} from '../_models/single-hour';
import {CityJSON} from '../_models/city-json';

@Injectable({
  providedIn: 'any'
})
export class JsonReaderService {
  public lat: number;
  public long: number;
  public weatherJSON: WeatherJSON;
  public hourlyJSON: HourlyJSON;
  public nextTwelveHours: SingleHour[] = [];
  public url = '';
  public city: string;
  public cityJSON: CityJSON;
  public cityOutOfBounds: boolean;
  constructor() { }

  // get current location json, or city json if searched
  getLocation(): Promise<string> {
      return new Promise((resolve, reject) => {
        if (!this.city) {
          navigator.geolocation.getCurrentPosition(position => {
            if (position) {
              this.lat = position.coords.latitude;
              this.long = position.coords.longitude;
              this.url = 'https://api.weather.gov/points/' +
                position.coords.latitude + ',' +
                position.coords.longitude;
              return resolve(this.url);
            } else {
              return reject('geo');
            }
          });
        }
        else {
          this.getCityLatLong(this.city).then(() => {
            // USA bounds
            if (this.cityJSON[0].lat > 19.50139 && this.cityJSON[0].lon > -161.75583 &&
            this.cityJSON[0].lat < 64.85694 && this.cityJSON[0].lon < -68.01197) {
              this.lat = this.cityJSON[0].lat;
              this.long = this.cityJSON[0].lon;
              this.cityOutOfBounds = false;
              resolve(this.url = 'https://api.weather.gov/points/' +
                this.lat + ',' + this.long);
            }
            else {
              this.city = '';
              this.cityOutOfBounds = true;
              resolve(this.url = 'https://api.weather.gov/points/' +
                this.lat + ',' + this.long);
            }
          });
        }
      });
    }

    // get weather json
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

  // get hourly weather json
  getHourly(json: WeatherJSON): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!json) {
        reject('Hourly JSON not fetched');
      } else {
        fetch(json.properties.forecastHourly)
          .then(res => res.json())
          .then(out => {
            resolve(this.hourlyJSON = out);
          });
      }
    });
  }
  // gets the next twelve hours of data to display
  getNextTwelveHours(): Promise<void> {
    this.nextTwelveHours = [];
    return new Promise( (resolve) => {
      for (let i = 1; i < 13; i++) {
        this.nextTwelveHours.push(this.hourlyJSON.properties.periods[i]);
      }
      resolve();
    });
  }
  // gets the high and low temps for the rest of the day
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
    return 'API error';
  }

  // Nominatim city API query
  getCityLatLong(city: string): Promise<void> {
    this.city = city;
    this.city.replace(' ', '+');
    return new Promise((resolve, reject) => {
        fetch('https://nominatim.openstreetmap.org/?addressdetails=1&q=' + city + '&format=json&limit=1')
          .then(res => res.json())
          .then(out => {
            console.log(out);
            this.cityJSON = out;
            resolve(out);
        }).catch(err => {
          reject(err);
        });
    });
  }
}
