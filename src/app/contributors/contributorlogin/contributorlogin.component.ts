import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContributorloginserviceService } from '../contributorloginservice.service';

@Component({
  selector: 'app-contributorlogin',
  templateUrl: './contributorlogin.component.html',
  styleUrls: ['./contributorlogin.component.css']
})
export class ContributorloginComponent implements OnInit {
  user = {
    id: "",
    password: ""
  }
  constructor(private loginService: ContributorloginserviceService, private router: Router) { }

  ngOnInit() {
    this.loginService.authStatus.subscribe((msg) => {
      if (msg) {
        this.router.navigate(['/contributors', 'homepage']);
      }
    })
  }
  onSubmit() {
    if (this.user.id == "" || this.user.password == "") {
      alert("enter necessary details");
    }
    else {
      this.loginService.loginUser(this.user);
    }
  }

}
