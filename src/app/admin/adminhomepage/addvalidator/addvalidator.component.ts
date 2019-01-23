import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';

@Component({
  selector: 'app-addvalidator',
  templateUrl: './addvalidator.component.html',
  styleUrls: ['./addvalidator.component.css']
})
export class AddvalidatorComponent implements OnInit {
  selectedValidator = {
    id: "",
    name: "",
    password: "",
    password2:"",
    subjectsAssigned: ""
  }
  constructor(private adminLoginService: AdminloginserviceService) { }

  ngOnInit() {
  }
  onSubmit() {
    this.adminLoginService.postValidator(this.selectedValidator).subscribe((res) => {
      alert(res);
    },
    (err)=>{
      alert(err);
    })
  }

}
