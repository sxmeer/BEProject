import { Component, OnInit } from '@angular/core';
import { ContributoraddquestionserviceService } from '../contributoraddquestionservice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContributorloginserviceService } from '../contributorloginservice.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contributorhomepage',
  templateUrl: './contributorhomepage.component.html',
  styleUrls: ['./contributorhomepage.component.css']
})
export class ContributorhomepageComponent implements OnInit{
  subjectDetail;
  constructor(private contributorAddQuestion: ContributoraddquestionserviceService,private loginService: ContributorloginserviceService,private http: HttpClient) { }
  questionList = [1];
  questionCounter = 1;
  ngOnInit() {
    
  }
  addQuestion() {
    this.questionCounter++;
    this.questionList.push(this.questionCounter);
    this.contributorAddQuestion.incrementCounter();
  }
  remover(event) {
    this.contributorAddQuestion.decrementCounter();
    document.getElementById(event.id).remove();
  }
  submitQuestions() {
    alert(this.contributorAddQuestion.submitQuestions());
  }
}
