import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import {JsonReaderService} from '../_services/json-reader.service';
import {SingleHour} from '../_models/single-hour';
import {DateTime} from 'luxon';
import {LuxonDate} from '../_models/luxon-date';
import {Nl2BrPipeModule} from 'nl2br-pipe';

@Component({
  selector: 'app-weather-card-today',
  templateUrl: './weather-card-today.component.html',
  styleUrls: ['./weather-card-today.component.css']
})
export class WeatherCardTodayComponent implements OnInit, OnDestroy {
  public time: number;
  public date: LuxonDate;
  public displayDate: string;
  private interval;
  public icon: string;
  public isDayTime: boolean;
  public nextTwelveHours: SingleHour[];
  public hours: string[] = [];
  public highLow: string;
  public isRain: boolean;
  public isSun: boolean;
  public isSnow: boolean;
  public missing: boolean;
  public loadingCity = false;
  public invalidCity = false;
  constructor(public jsonReaderService: JsonReaderService) {
  }

  ngOnInit(): void {
    // error if api takes longer than 3 seconds to load
    const timeout = setTimeout(() => {
      this.invalidCity = true;
      this.loadingCity = false;
      this.jsonReaderService.cityOutOfBounds = false;
    }, 6000);
    this.isRain = false;
    this.isSun = false;
    this.isSnow = false;
    this.jsonReaderService.getLocation().then(res => {
      this.jsonReaderService.getInitialJson(res).then(() => {
          this.jsonReaderService.getHourly(this.jsonReaderService.weatherJSON).then(() => {
              // stop loading symbol
              this.loadingCity = false;
              this.invalidCity = false;
              clearTimeout(timeout);
              // initialize time and date for location
              this.date = DateTime.local().setZone(this.jsonReaderService.weatherJSON.properties.timeZone);
              this.time = ((this.date.c.hour * 60 + this.date.c.minute) * 100) / 1440;
              // format date to be displayed
              this.displayDate = this.getDisplayDate();
          });
        }
      );
    });

    // initial render of images & background
    this.renderNextTwelveHours();

    // update time, date, and hourly boxes
    this.interval = setInterval(() => {
      this.time = ((this.date.c.hour * 60 + this.date.c.minute) * 100) / 1440;
      this.displayDate = this.getDisplayDate();
      this.renderNextTwelveHours();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  // get time for cards
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

  // get time for progress bar
  getDisplayDate(): string {
    this.date = DateTime.local().setZone(this.jsonReaderService.weatherJSON.properties.timeZone);
    const singleMinDigit = this.date.c.minute.toString().length === 1;
    if (this.date.c.hour < 12 && this.date.c.hour > 0) {
      if (singleMinDigit) {
        return this.date.c.hour + ':0' + this.date.c.minute + ' AM';
      }
      else {
        return this.date.c.hour + ':' + this.date.c.minute + ' AM';
      }
    }
    else if (this.date.c.hour > 1) {
      if (singleMinDigit) {
        return (this.date.c.hour - 12) + ':0' + this.date.c.minute + ' PM';
      }
      else {
        return (this.date.c.hour - 12) + ':' + this.date.c.minute + ' PM';
      }
    }
    else {
      if (singleMinDigit) {
        return '12:0' + this.date.c.minute + ' AM';
      }
      else {
        return '12:' + this.date.c.minute + ' AM';
      }
    }
  }

  renderNextTwelveHours(): void {
    this.jsonReaderService.getLocation().then(res => {
      this.jsonReaderService.getInitialJson(res).then(() => {
        this.jsonReaderService.getHourly(this.jsonReaderService.weatherJSON).then(() => {
          this.jsonReaderService.getNextTwelveHours().then(() => {
            // dynamic background images and high/low text
            this.nextTwelveHours = this.jsonReaderService.nextTwelveHours;
            this.icon = this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast;
            this.isDayTime = this.jsonReaderService.hourlyJSON.properties.periods[0].isDaytime;
            this.highLow = this.jsonReaderService.getHighLow();
            console.log(this.jsonReaderService.hourlyJSON);
            if (this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLocaleLowerCase().includes('sun')) {
              this.isSun = true;
            } else if (this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLocaleLowerCase().includes('rain') ||
              this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLowerCase().includes('thunder')) {
              this.isRain = true;
            } else if (this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast.toLocaleLowerCase().includes('snow')) {
              this.isSnow = true;
            }
            this.missing = (!this.isRain && !this.isSnow && !this.isSun);
          });
        });
      });
    });
  }

  // get city name and refresh
  getCityName(name: string): void {
    this.jsonReaderService.city = name;
    this.loadingCity = true;
    this.ngOnInit();
  }
}
