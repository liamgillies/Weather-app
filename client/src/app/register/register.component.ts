import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth-service';
import {Router} from '@angular/router';

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
  public submitted = false;
  public usernameTaken: boolean;
  constructor(private authService: AuthService,
              private router: Router) {
    if (this.authService.getCurrentUserValue()) {
      this.router.navigate(['/today']);
    }
  }

  ngOnInit(): void {
  }

  register(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.authService.register({
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value,
      email: this.registerForm.controls.email.value
    }).subscribe(res => {
      // @ts-ignore
      if (!res) {
        this.usernameTaken = true;
        console.log(this.usernameTaken);
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

}
