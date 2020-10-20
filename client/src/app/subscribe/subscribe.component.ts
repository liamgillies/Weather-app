import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {EmailService} from '../_services/email.service';
import {JsonReaderService} from '../_services/json-reader.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  emailForm = new FormGroup({
    email: new FormControl(''),
    daily: new FormControl(''),
    weekly: new FormControl('')
  });
  private url: string;
  private timeZone: string;
  constructor(private emailService: EmailService,
              private jsonReaderService: JsonReaderService) { }

  ngOnInit(): void {
    this.jsonReaderService.city = '';
    this.jsonReaderService.getLocation().then(res => {
      this.url = res;
    }).then(() => {
      fetch(this.url)
        .then(res => res.json())
        .then(res => this.timeZone = res.properties.timeZone);
    });
  }

  addEmail(): void {
    if (this.url === '') {
      throw new Error('URL broken XD');
    }
    console.log('submitted');
    console.log(this.timeZone);

    this.emailService.addEmail(
      {email: this.emailForm.controls.email.value,
            daily: this.emailForm.controls.daily.value,
            weekly: this.emailForm.controls.weekly.value,
            url: this.url,
            timeZone: this.timeZone}
      ).subscribe();
  }

}
