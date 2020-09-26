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
  public inC = false;
  public inF = true;
  public fTemp: number;
  public icon: string;
  public isDayTime: boolean;
  public nextTwelveHours: SingleHour[];
  public hours: string[] = [];
  public highLow: string;
  constructor(public jsonReaderService: JsonReaderService) {
  }

  ngOnInit(): void {
     const iconInterval = setInterval(() => {
      this.icon = this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast;
      this.isDayTime = this.jsonReaderService.hourlyJSON.properties.periods[0].isDaytime;
      this.nextTwelveHours = this.jsonReaderService.getNextTwelveHours();
      this.highLow = this.jsonReaderService.getHighLow();
      },
      100);

     const d = new Date();
     this.time = ((d.getHours() * 60 + d.getMinutes()) * 100) / 1440;
     this.interval = setInterval(() => {
        this.time = ((d.getHours() * 60 + d.getMinutes()) * 100) / 1440;
        this.jsonReaderService.getNextTwelveHours();
        if (this.icon || this.isDayTime) {
          clearInterval(iconInterval);
        }
      }, 30000);
  }

  ngOnDestroy(): void {
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  convertToC(): void {
    if (this.inF) {
      this.fTemp = this.jsonReaderService.hourlyJSON.properties.periods[0].temperature;
      this.jsonReaderService.hourlyJSON.properties.periods[0].temperature =
        Math.round(((this.jsonReaderService.hourlyJSON.properties.periods[0].temperature - 32) * 5 / 9)
      * 10) / 10;
      this.inF = false;
      this.inC = true;
    }
  }

  convertToF(): void {
    if (this.inC) {
      this.jsonReaderService.hourlyJSON.properties.periods[0].temperature = this.fTemp;
      this.inF = true;
      this.inC = false;
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
}
