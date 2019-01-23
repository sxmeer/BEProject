import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
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
  constructor(private router: Router,
    private validatorlogin: ValidatorloginserviceService,
    private contributorlogin: ContributorloginserviceService,
    private adminlogin: AdminloginserviceService) { }

  ngOnInit() {
    this.adminlogin.authStatus.subscribe((authStatus)=>{
      this.isLoggedIn=authStatus;
    })
    this.contributorlogin.authStatus.subscribe((authStatus)=>{
      this.isLoggedIn=authStatus;
    })
    this.validatorlogin.authStatus.subscribe((authStatus)=>{
      this.isLoggedIn=authStatus;
    })
  }
  logOut(){
    this.isLoggedIn=false;
    this.adminlogin.logout();
    this.contributorlogin.logout();
    this.validatorlogin.logout();
  }

}
