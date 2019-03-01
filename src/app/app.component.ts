import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // authenticated: Boolean;
  // authListenerSubs: Subscription;
  ngOnInit() {
    // this.authListenerSubs = this.login.authStatus.subscribe((status) => {
    //   this.authenticated = status;
    // })
  }
   constructor() {
  // constructor(private login: LoginService) {
  }
  // logout() {
  //   this.login.logout();
  // }
}
