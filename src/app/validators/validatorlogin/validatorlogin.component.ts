import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidatorloginserviceService } from '../validatorloginservice.service';

@Component({
  selector: 'app-validatorlogin',
  templateUrl: './validatorlogin.component.html',
  styleUrls: ['./validatorlogin.component.css']
})
export class ValidatorloginComponent implements OnInit {
  user = {
    id: "",
    password: ""
  }

  constructor(private loginService: ValidatorloginserviceService, private router:Router) { }

  ngOnInit() {
    this.loginService.authStatus.subscribe((msg)=>{
      if(msg){
        this.router.navigate(['/validators', 'homepage']);
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
