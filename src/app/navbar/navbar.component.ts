import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidatorloginserviceService } from '../validators/validatorloginservice.service';
import { ContributorloginserviceService } from '../contributors/contributorloginservice.service';
import { AdminloginserviceService } from '../admin/adminloginservice.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: Boolean;
  isAdmin: Boolean;
  isContributor: Boolean;
  isValidator: Boolean;
  userName: string;
  constructor(private router: Router,
    private validatorlogin: ValidatorloginserviceService,
    private contributorlogin: ContributorloginserviceService,
    private adminlogin: AdminloginserviceService) { }

  ngOnInit() {
    this.adminlogin.authStatus.subscribe((authStatus) => {
      this.isAdmin = true;
      this.isLoggedIn = authStatus;
    });
    this.contributorlogin.authStatus.subscribe((authStatus) => {
      this.isContributor = true;
      this.isLoggedIn = authStatus;
    });
    this.validatorlogin.authStatus.subscribe((authStatus) => {
      this.isValidator = true;
      this.isLoggedIn = authStatus;
    });
    this.adminlogin.userName.subscribe((name) => {
      this.userName = name;
    });
    this.validatorlogin.userName.subscribe((name) => {
      this.userName = name;
    });
    this.contributorlogin.userName.subscribe((name) => {
      this.userName = name;
    })
  }
  logOut() {
    this.isLoggedIn = false;
    this.adminlogin.logout();
    this.contributorlogin.logout();
    this.validatorlogin.logout();
    this.isAdmin = false;
    this.isContributor = false;
    this.isValidator = false;
  }
}
