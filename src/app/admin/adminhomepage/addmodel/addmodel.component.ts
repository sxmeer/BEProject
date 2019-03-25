import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminloginserviceService } from '../../adminloginservice.service';

@Component({
  selector: 'app-addmodel',
  templateUrl: './addmodel.component.html',
  styleUrls: ['./addmodel.component.css']
})
export class AddmodelComponent implements OnInit {

  title = "model";
  question: Number = 0; // for iterating the number of questions
  list = []; //for iterating in the angular code
  questionList = []; //the list for question model
  questionNumber: Number; //assigning question number in the model
  marks: Number; //assigning marks in the model
  total: Number = 0; //for total marks of the model

  constructor(private loginService: AdminloginserviceService) {}
  ngOnInit() {}

  changeList() {
    this.list = [];
    for (let i = 1; i <= this.question; i++) {
      this.list.push(i);
    }
  }
  insertIntoList() {
    this.questionList.push({
      questionNumber: Number(this.questionNumber),
      marks: Number(this.marks)
    });
    this.calculateTotal();
    console.log(this.questionList);
  }
  listPop() {
    this.questionList.pop();
    this.calculateTotal();
  }
  calculateTotal() {
    let sum = 0;
    for (let i = 0; i < this.questionList.length; i++) {
      sum += this.questionList[i].marks;
    }
    this.total = sum;
  }
  submitModel(){
    console.log("angular hit");
    this.loginService.getContributors();
    if(this.total <= 0) {
      alert('Please Enter Model');
      return;
    }
    this.loginService.postModel({
      numberOfQuestions: this.question ,
      questionModelList: this.questionList,
      totalMarks: this.total
    });
  }
}
