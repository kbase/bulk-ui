import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { KBaseAuth } from '../services/kbase-auth.service';


@Component({
  template: `
    <h2>LOGIN</h2>
    <p>{{message}}</p>
    <p>
      <button (click)="login()"  *ngIf="!authService.isLoggedIn">Login</button>
      <button (click)="logout()" *ngIf="authService.isLoggedIn">Logout</button>
    </p>`
})
export class LoginComponent {
  message: string;
  constructor(public authService: KBaseAuth, public router: Router) {
    this.setMessage();
  }
  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }
  login() {
      this.message = 'Trying to log in ...';
      console.log('attempt to login')

  }
  logout() {
    this.authService.logout();
    this.setMessage();
  }
}