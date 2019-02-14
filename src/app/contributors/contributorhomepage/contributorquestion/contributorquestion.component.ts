import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ContributoraddquestionserviceService } from '../../contributoraddquestionservice.service';
import { ContributordataService } from '../../contributordata.service';

@Component({
  selector: 'app-contributorquestion',
  templateUrl: './contributorquestion.component.html',
  styleUrls: ['./contributorquestion.component.css']
})
export class ContributorquestionComponent implements OnInit {
  @Input() id: string;
  @ViewChild('child') child: ElementRef;
  @Output() removeEmitter = new EventEmitter<ElementRef>();
  disabled = false;
  question = "";
  mark;
  difficulty;
  cognitive;
  module;
  questionDetail: {
    id,
    mark, question, difficulty,
    cognitive,
    module
  };
  constructor(private contributorAddQuestion: ContributoraddquestionserviceService, private data: ContributordataService) { }
  subjectDetail;
  ngOnInit() {
    this.data.subjectData.subscribe(data => {
      this.subjectDetail = data;
      console.log(data);
    });
    this.data.getData();
  }
  // ngOnDestroy() {
  //   this.data.subjectData.unsubscribe();
  // }
  lock() {
    if (this.question == "" || this.module == undefined || this.mark == undefined
      || this.cognitive == undefined || this.difficulty == undefined) {
      alert("enter necessary details before locking");
      return;
    }
    this.disabled = true;
    this.questionDetail = {
      id: this.id,
      mark: Number(this.mark),
      cognitive: this.cognitive,
      module: this.module,
      difficulty: this.difficulty,
      question: this.question
    }
    this.contributorAddQuestion.enterQuestion(this.questionDetail);
  }
  unlock() {
    this.disabled = false;
    this.contributorAddQuestion.removeQuestion(this.id);
  }
  remove(element: ElementRef) {
    this.removeEmitter.emit(element);
    this.contributorAddQuestion.removeQuestion(this.id);
  }
}
