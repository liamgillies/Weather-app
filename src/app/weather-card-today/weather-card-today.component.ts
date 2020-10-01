import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import {JsonReaderService} from '../_services/json-reader.service';
import {SingleHour} from '../_models/single-hour';

@Component({
  selector: 'app-weather-card-today',
  templateUrl: './weather-card-today.component.html',
  styleUrls: ['./weather-card-today.component.css']
})
export class WeatherCardTodayComponent implements OnInit, OnDestroy {
  public time: number;
  public date = new Date();
  private interval;
  public fTemp: number;
  public icon: string;
  public isDayTime: boolean;
  public nextTwelveHours: SingleHour[];
  public hours: string[] = [];
  public highLow: string;
  public isRain: boolean;
  public isSun: boolean;
  public isSnow: boolean;
  public missing: boolean;
  public cityName: string;
  constructor(public jsonReaderService: JsonReaderService) {
  }

  ngOnInit(): void {
    this.isRain = false;
    this.isSun = false;
    this.isSnow = false;
    this.jsonReaderService.getLocation().then(res => {
      this.jsonReaderService.getInitialJson(res).then(() => {
          this.jsonReaderService.getHourly(this.jsonReaderService.weatherJSON).then(() => {
              this.jsonReaderService.getNextTwelveHours().then(() => {
                this.nextTwelveHours = this.jsonReaderService.nextTwelveHours;
                this.icon = this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast;
                this.isDayTime = this.jsonReaderService.hourlyJSON.properties.periods[0].isDaytime;
                this.highLow = this.jsonReaderService.getHighLow();
                console.log(this.jsonReaderService.hourlyJSON);
                if (this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLocaleLowerCase().includes('sun')) {
                  this.isSun = true;
                }
                else if (this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLocaleLowerCase().includes('rain') ||
                this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLowerCase().includes('thunder')) {
                  this.isRain = true;
                }
                else if (this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLocaleLowerCase().includes('snow')) {
                  this.isSnow = true;
                }
                this.missing = (!this.isRain && !this.isSnow && !this.isSun);
                console.log(this.missing);
              });
          });
        }
      );
    });

    const d = new Date();
    this.time = ((d.getHours() * 60 + d.getMinutes()) * 100) / 1440;

    this.interval = setInterval(() => {
        this.time = ((d.getHours() * 60 + d.getMinutes()) * 100) / 1440;
      }, 30000);
  }

  ngOnDestroy(): void {
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  getTime(hour): string {
    if (hour.startTime.substring(11, 12) === '0') {
      if (hour.startTime.substring(11, 13) === '00') {
        return 12 + 'am';
      }
      return hour.startTime.substring(12, 13) + 'am';
    }
    else {
      let x = parseInt(hour.startTime.substring(11, 13), 10);
      if (hour.startTime.substring(11, 13) === '10') {
        return 10 + 'am';
      }
      if (hour.startTime.substring(11, 13) === '11') {
        return 11 + 'am';
      }
      if (hour.startTime.substring(11, 13) === '12') {
        return 12 + 'pm';
      }
      x -= 12;
      return x + 'pm';
    }
  }

  getCityName(name: string): void {
    this.jsonReaderService.city = name;
    this.ngOnInit();
  }
}
