import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
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
    daily: new FormControl(true),
    weekly: new FormControl(true)
  });
  private url: string;
  private timeZone: string;
  private button: HTMLElement;
  private invalidEmail: HTMLElement;
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
    this.button = document.getElementById('submit') as HTMLElement;
    this.invalidEmail = document.getElementById('invalid-email') as HTMLElement;
  }

  addEmail(): void {
    if (this.url === '') {
      throw new Error('URL broken XD');
    }

    const re = /\S+@\S+\.\S+/;
    if (!re.test(this.emailForm.controls.email.value)) {
      this.invalidEmail.classList.remove('hidden');
      this.invalidEmail.classList.add('email-warning');
      console.log('bad email');
      return;
    }
    else {
      this.invalidEmail.classList.add('hidden');
    }

    this.button.classList.add('green');
    this.button.classList.remove('btn-primary');
    this.button.innerHTML = 'Success!';
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

  dailyClicked(): void {
    // @ts-ignore
    this.emailForm.controls.daily.value = !this.emailForm.controls.daily.value;
  }

  weeklyClicked(): void {
    // @ts-ignore
    this.emailForm.controls.weekly.value = !this.emailForm.controls.weekly.value;
  }

}
