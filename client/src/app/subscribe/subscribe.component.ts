import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {EmailsService} from '../_services/emails.service';
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

  constructor(private emailService: EmailsService,
              private jsonReaderService: JsonReaderService) { }

  ngOnInit(): void {
    this.jsonReaderService.city = '';
    this.jsonReaderService.getLocation().then(res => {
      this.url = res;
    });
  }

  addEmail(): void {
    if (this.url === '') {
      throw new Error('URL broken XD');
    }
    this.emailService.addEmail(
      {email: this.emailForm.controls.email.value,
            daily: this.emailForm.controls.daily.value,
            weekly: this.emailForm.controls.weekly.value,
            url: this.url}
      ).subscribe();
  }

}
