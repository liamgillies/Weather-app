import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth-service';
import {User} from "../_models/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private currentUser: User;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.authService.getCurrentUserValue() != null;
  }

  logout(): void {
    this.authService.logout();
  }
}

