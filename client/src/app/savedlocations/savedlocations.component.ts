import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user-service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../_services/auth-service";
import {JsonReaderService} from "../_services/json-reader.service";
import {JsonArray} from "@angular/compiler-cli/ngcc/src/packages/entry_point";

@Component({
  selector: 'app-savedlocations',
  templateUrl: './savedlocations.component.html',
  styleUrls: ['./savedlocations.component.css']
})
export class SavedlocationsComponent implements OnInit {
  locationForm = new FormGroup({
    location: new FormControl('', [Validators.required])
  });

  public locations: string[];
  public submitted = false;
  public form: HTMLElement;
  public formattedLocations: JsonArray = [];
  constructor(private userService: UserService,
              private authService: AuthService,
              private jsonReaderService: JsonReaderService) {
  }

  ngOnInit(): void {
    this.form = document.getElementById('popup') as HTMLElement;
    this.locations = this.authService.getCurrentUserValue().savedLocations;
    this.format();
    console.log(this.formattedLocations);
  }

  openForm(): void {
    this.form.classList.remove('hidden');
    this.form.classList.add('location-section');
  }

  format(): void {
    // get array of JSONS for formatting
    // use counter for deleting locations; simulates database _id
    this.formattedLocations = [];
    let counter = 0;
    this.locations.forEach(location => {
      const temp = {city: '', state: '', currentWeather: '', currentTemperature: '', high: '', low: '', count: counter};
      fetch(location)
        .then(res => res.json())
        .then(res => {
          temp.city = res.properties.relativeLocation.properties.city;
          temp.state = res.properties.relativeLocation.properties.state;

          // get hourly data
          fetch(res.properties.forecastHourly)
            .then(res1 => res1.json())
            .then(res1 => {
              temp.currentWeather = res1.properties.periods[0].shortForecast;
              temp.currentTemperature = res1.properties.periods[0].temperature;
              // get max and min temps for the day
              let min = res1.properties.periods[0].temperature;
              let max = res1.properties.periods[0].temperature;
              for (const ele of res1.properties.periods){
                if (ele.temperature > max){
                  max = ele.temperature;
                }
                if (ele.temperature < min){
                  min = ele.temperature;
                }
                if (ele.startTime.substring(11, 13) === '00'){
                  break;
                }
              }
              temp.high = max;
              temp.low = max;

            });
        });
      this.formattedLocations.push(temp);
      counter++;
    });
  }


  delete(count: number): void {
    this.userService.deleteLocation(count, this.authService.getCurrentUserValue()._id).subscribe(() => {
      this.authService.removeLocation(count);
      this.locations = this.authService.getCurrentUserValue().savedLocations;
      this.format();
      console.log(this.formattedLocations);
    });
  }

  add(): void {
    this.submitted = true;
    this.jsonReaderService.getCityLatLong(this.locationForm.controls.location.value)
      .then(() => this.jsonReaderService.getLocation())
      .then(res => {
        console.log(res);
        this.userService.addLocation(res, this.authService.getCurrentUserValue()._id)
          .subscribe(() => {
            this.submitted = false;
            this.authService.addLocation(res);
            this.locations = this.authService.getCurrentUserValue().savedLocations;
            this.format();
            this.form.classList.add('hidden');
            this.form.classList.remove('location-section');
          });
      });
  }

}
