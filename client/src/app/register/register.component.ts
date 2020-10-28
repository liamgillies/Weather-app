import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6),
      Validators.maxLength(18), Validators.pattern('^[a-zA-Z0-9._]+$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.email]),
  });
  private submitted = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  register(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    console.log('registering');
    this.userService.register({
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value,
      email: this.registerForm.controls.email.value
    }).subscribe();
  }

}
