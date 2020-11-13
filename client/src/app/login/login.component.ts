import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user-service';
import {CommonModule} from '@angular/common';
import {AuthService} from '../_services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  public submitted = false;
  constructor(private authService: AuthService,
              private router: Router) {
    if (this.authService.getCurrentUserValue() != null) {
      this.router.navigate(['/today']);
    }
  }

  ngOnInit(): void {
  }

  login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login({
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }).subscribe();
    this.router.navigate(['/today']);
  }

}
