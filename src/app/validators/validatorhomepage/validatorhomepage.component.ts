import { Component, OnInit } from '@angular/core';
import { ValidatordataService } from '../validatordata.service';

@Component({
  selector: 'app-validatorhomepage',
  templateUrl: './validatorhomepage.component.html',
  styleUrls: ['./validatorhomepage.component.css']
})
export class ValidatorhomepageComponent implements OnInit {
  diff = ["Easy", "Medium", "Difficult"];
  cog = ["Application","Comprehension","Knowledge"];
  constructor(private dataService:ValidatordataService) { }
  ngOnInit() {
  }
  addQuestion(){
    this.dataService.getRandomQuestions();
  }
}