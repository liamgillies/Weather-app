import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import {ajaxGetJSON} from 'rxjs/internal-compatibility';
import {JsonReaderService} from '../_services/json-reader.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styles: [
  ]
})
export class LocationComponent implements OnInit {
  public lat = 0;
  public long = 0;
  public url = 'https://api.weather.gov/points/';
  public weatherJSON = {};
  constructor() {}

  ngOnInit(): void {
  }

  getLocation(): void{
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      this.url += this.lat + ',' + this.long;
    });
  }

  update(): void{
    if (this.url === 'https://api.weather.gov/points/'){
      console.log('please get location');
    }
    else {
      fetch(this.url)
        .then(res => res.json())
        .then(out => this.weatherJSON = out);
    }
    console.log(this.weatherJSON);
  }

}
