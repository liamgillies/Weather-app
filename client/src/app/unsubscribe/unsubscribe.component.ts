import { Component, OnInit } from '@angular/core';
import {EmailService} from '../_services/email.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {
  private id: string;

  constructor(private emailService: EmailService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.emailService.removeEmail(this.id).subscribe();
  }

}
