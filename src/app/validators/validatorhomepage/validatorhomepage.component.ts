import { Component, OnInit } from '@angular/core';
import { ValidatordataService } from '../validatordata.service';
import { ValidatorloginserviceService } from '../validatorloginservice.service';

@Component({
  selector: 'app-validatorhomepage',
  templateUrl: './validatorhomepage.component.html',
  styleUrls: ['./validatorhomepage.component.css']
})
export class ValidatorhomepageComponent implements OnInit {
  diff = ["Easy", "Medium", "Difficult"];
  cog = ["Application","Comprehension","Knowledge"];
  subjectStatus;
  constructor(public dataService: ValidatordataService, public loginService: ValidatorloginserviceService) { }
  ngOnInit() {
    this.loginService.statusUpdate.subscribe(data => {
      this.subjectStatus = data;
    })
    this.loginService.getSubjectStatus();
  }
  addQuestion(){
    this.dataService.getRandomQuestions();
  }
}
