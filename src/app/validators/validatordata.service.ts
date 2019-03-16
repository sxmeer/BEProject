import { Injectable } from '@angular/core';
import { ValidatorloginserviceService } from './validatorloginservice.service';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValidatordataService {
  constructor(private loginService: ValidatorloginserviceService, private http: HttpClient) { }
  subjectData = new Subject();
  Questions;
  getData() {
    let params = new HttpParams().set("id", this.loginService.getSubjectsAssigned());
    this.http.get('http://localhost:3000/validators/courseDetail', { params }).subscribe((data) => {
      this.subjectData.next(data);
    })
  }
  getRandomQuestions() {
    this.Questions = null;
    this.http.get('http://localhost:3000/validators/getRandomQuestion' + `/${this.loginService.getSubjectsAssigned()}`).subscribe((data) => {
      this.Questions = data;
      console.log(data);
    })
  }
  markAsValidQuestion(question) {
    this.Questions = this.Questions.filter((ques) => {
      return ques._id != question._id;
    })
    this.http.get('http://localhost:3000/validators/markAsValidQuestion' + `/${question._id}`).subscribe((data) => {
      alert('Successfully validated');
    })
  }

  skip(question) {
    this.Questions = this.Questions.filter((ques) => {
      return ques._id != question._id;
    })
  }

  markAsInvalidQuestion(question) {
    this.Questions = this.Questions.filter((ques) => {
      return ques._id != question._id;
    })
    this.http.get('http://localhost:3000/validators/markAsInvalidQuestion' + `/${question._id}`).subscribe((data) => {
      alert('Successfully validated');
    })
  }
}
