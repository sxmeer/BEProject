import { Component, OnInit } from '@angular/core';
import { ContributoraddquestionserviceService } from '../contributoraddquestionservice.service';

@Component({
  selector: 'app-contributorhomepage',
  templateUrl: './contributorhomepage.component.html',
  styleUrls: ['./contributorhomepage.component.css']
})
export class ContributorhomepageComponent implements OnInit {

  constructor(private contributorAddQuestion: ContributoraddquestionserviceService) { }
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
