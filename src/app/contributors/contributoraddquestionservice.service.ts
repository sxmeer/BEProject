import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContributoraddquestionserviceService {
  questionCounter: number = 1;
  questionList = [];
  constructor() { }
  incrementCounter() {
    this.questionCounter++;
  }
  decrementCounter() {
    this.questionCounter--;
  }
  submitQuestions(): string {
    if (this.questionCounter < 1) {
      return "submit atleast one question";
    }
    if (this.questionCounter != this.questionList.length)
      return "lock all questions before submission";
    else {
      console.log(this.questionList);
      return "successfully submitted in the database";
    }
  }
  enterQuestion(question) {
    this.questionList.push(question);
  }
  removeQuestion(id) {
    const index = this.questionList.findIndex((value) => {
      return value.id === id;
    })
    if (index > -1) {
      this.questionList.splice(index, 1);
    }
    console.log(this.questionList);
  }
}
