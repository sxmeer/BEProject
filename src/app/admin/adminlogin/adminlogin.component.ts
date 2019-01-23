import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../adminloginservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {
  user = {
    id: "",
    password: ""
  }

  constructor(private loginService: AdminloginserviceService, private router:Router) { }

  ngOnInit() {
    this.loginService.authStatus.subscribe((msg)=>{
      if(msg){
        this.router.navigate(['/admin', 'homepage']);
      }
    })
  }
  onSubmit() {
    if (this.user.id == "" || this.user.password == "") {
      alert("enter necessary details");
    }
    else{
      this.loginService.loginUser(this.user);
    }
  }
}
