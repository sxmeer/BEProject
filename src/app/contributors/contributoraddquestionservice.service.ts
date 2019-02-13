import { Injectable } from '@angular/core';
import { ContributorloginserviceService } from './contributorloginservice.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContributoraddquestionserviceService {
  questionCounter: number = 1;
  questionList = [];
  questionListCopy = [];
  constructor(private logindata: ContributorloginserviceService, private http: HttpClient) { }
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
      this.questionListCopy=[];
      for(let i=0;i<this.questionList.length;i++){
        // questionID,module,question,marks,difficulty,cognitive,subjectID,contributorID,isValid,asked,checked
        this.questionListCopy.push({
          module:this.questionList[i].module,
          question:this.questionList[i].question,
          marks:this.questionList[i].mark,
          difficulty:this.questionList[i].difficulty,
          cognitive:this.questionList[i].cognitive,
          subjectID:Number(this.logindata.getSubjectsAssigned()),
          contributorID:Number(this.logindata.getid()),
        })
      }
      console.log(this.questionListCopy);
      this.http.post<{msg:String}>('http://localhost:3000/contributors/addQuestions',this.questionListCopy).subscribe((doc)=>{
        return doc.msg;
      })
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
