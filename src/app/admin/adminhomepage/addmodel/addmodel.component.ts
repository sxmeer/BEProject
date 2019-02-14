import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addmodel',
  templateUrl: './addmodel.component.html',
  styleUrls: ['./addmodel.component.css']
})
export class AddmodelComponent implements OnInit {

  title = "model";
  question: Number = 0;
  questionList = [];
  questionNumber: Number;
  marks: Number;
  list = [];
  total: Number = 0;

  constructor() {}
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

}
