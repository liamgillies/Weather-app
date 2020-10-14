import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {EmailsService} from '../_services/emails.service';

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

  constructor(private emailService: EmailsService) { }

  ngOnInit(): void {
  }

  addEmail(): void {
    console.log(this.emailForm);
    this.emailService.addEmail(
      {email: this.emailForm.controls.email.value,
            daily: this.emailForm.controls.daily.value,
            weekly: this.emailForm.controls.weekly.value}
      ).subscribe((a) => console.log(a));
  }

}
