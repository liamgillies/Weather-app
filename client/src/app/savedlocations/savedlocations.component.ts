import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../_services/user-service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth-service';
import {JsonReaderService} from '../_services/json-reader.service';
import {JsonArray} from '@angular/compiler-cli/ngcc/src/packages/entry_point';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-savedlocations',
  templateUrl: './savedlocations.component.html',
  styleUrls: ['./savedlocations.component.css']
})
export class SavedlocationsComponent implements OnInit, OnDestroy {
  locationForm = new FormGroup({
    location: new FormControl('', [Validators.required])
  });

  public locations: string[];
  public submitted = false;
  public form: HTMLElement;
  public formattedLocations: JsonArray = [];
  public hidden = true;
  public interval;
  public loading = false;
  public outOfBounds = false;
  constructor(private userService: UserService,
              private authService: AuthService,
              private jsonReaderService: JsonReaderService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.authService.getCurrentUserValue()) {
      this.router.navigate(['/login']);
    }
    this.form = document.getElementById('popup') as HTMLElement;
    this.locations = this.authService.getCurrentUserValue().savedLocations;
    this.format();
    this.interval = setInterval(() => {
      const date = new Date(Date.now());
      // not zero, sometimes api bugs
      if (date.getMinutes() === 1){
        this.format().then();
      }
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  openForm(): void {
    this.hidden = false;
  }

  closeForm(): void {
    this.hidden = true;
    this.loading = false;
  }

  routeLocation(city: string): void {
    this.router.navigate(['/today']);
    this.jsonReaderService.city = city;
  }

  async format(): Promise<void> {
    // get array of JSONs for formatting
    // use counter for deleting locations; simulates database _id
    this.formattedLocations = [];
    let counter = 0;
    this.locations.forEach(location => {
      const temp = {
        city: '',
        state: '',
        currentTemperature: '',
        high: '',
        low: '',
        count: counter,
        shortForecast: '',
        isRain: false,
        isSnow: false,
        isSun: false,
        missing: false,
      };
      fetch(location)
        .then(res => res.json())
        .then(res => {
          temp.city = res.properties.relativeLocation.properties.city;
          temp.state = res.properties.relativeLocation.properties.state;

          // get hourly data
          fetch(res.properties.forecastHourly)
            .then(res1 => res1.json())
            .then(res1 => {
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
              temp.low = min;

              // dynamic backgrounds
              temp.shortForecast = res1.properties.periods[0].shortForecast;
              if (temp.shortForecast.toLocaleLowerCase().includes('sun')) {
                temp.isSun = true;
              } else if (temp.shortForecast.toLocaleLowerCase().includes('rain') || temp.shortForecast.toLowerCase().includes('thunder')) {
                temp.isRain = true;
              } else if (temp.shortForecast.toLocaleLowerCase().includes('snow')) {
                temp.isSnow = true;
              }
              temp.missing = (!temp.isRain && !temp.isSnow && !temp.isSun);
            });
        });
      this.formattedLocations.push(temp);
      counter++;
    });
    return;
  }


  delete(count: number): void {
    this.userService.deleteLocation(count, this.authService.getCurrentUserValue()._id).subscribe(() => {
      this.authService.removeLocation(count);
      this.locations = this.authService.getCurrentUserValue().savedLocations;
      this.format().then();
    });
  }

  add(): void {
    this.submitted = true;
    if (this.locationForm.invalid) {
      return;
    }
    this.loading = true;
    this.jsonReaderService.getCityLatLong(this.locationForm.controls.location.value)
      .then(res => {
        // USA bounds
        if (res[0].lat < 19.50139 || res[0].lon < -161.75583 || res[0].lat > 64.85694 || res[0].lon > -68.01197) {
          this.outOfBounds = true;
          this.loading = false;
          this.submitted = false;
          return;
        }
        console.log(res[0].lat);
        this.jsonReaderService.getLocation()
          .then(res1 => {
            this.userService.addLocation(res1, this.authService.getCurrentUserValue()._id)
              .subscribe(() => {
                this.authService.addLocation(res1);
                this.locations = this.authService.getCurrentUserValue().savedLocations;
                this.format().then(() => {
                  this.submitted = false;
                  this.hidden = true;
                  this.loading = false;
                });
                console.log(this.formattedLocations);
              });
          });
      });
  }

}
