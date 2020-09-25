import { Component, OnInit, OnDestroy } from '@angular/core';
import {JsonReaderService} from '../_services/json-reader.service';

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
  public fTemp;
  public icon;
  public isDayTime;
  constructor(public jsonReaderService: JsonReaderService) {
  }

  ngOnInit(): void {
    const iconInterval = setInterval(() => {
      this.icon = this.jsonReaderService.hourlyJSON.properties.periods[0].shortForecast;
      this.isDayTime = this.jsonReaderService.hourlyJSON.properties.periods[0].isDaytime;
      },
      100);
    const d = new Date();
    this.time = ((d.getHours() * 60 + d.getMinutes()) * 100) / 1440;
    this.interval = setInterval(() => {
        this.time = ((d.getHours() * 60 + d.getMinutes()) * 100) / 1440;
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
}
