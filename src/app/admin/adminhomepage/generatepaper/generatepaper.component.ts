import { Component, OnInit } from "@angular/core";
import { AdminloginserviceService } from "../../adminloginservice.service";
import { Models } from "../../models.model";
import { Department } from "../../department.model";
import { Semester } from "../../semesters.model";
import { Subjects } from "../../subjects.model";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-generatepaper",
  templateUrl: "./generatepaper.component.html",
  styleUrls: ["./generatepaper.component.css"]
})
export class GeneratepaperComponent implements OnInit {
  marksList = [];
  models: Models[];
  modelDesc: Models;
  questionDesc;
  public paperSpecification = {
    modelID: '',
    deptID: 0,
    semNo: 0,
    subID: 0,
    numberOfModules: 0,
    unitwiseDistribution: [],
    difficulty: [],
    cognitive: []
  };

  public depts: Department[];
  public semesters: Semester[];
  public subjects: Subjects[];

  constructor(private adminLoginService: AdminloginserviceService, private http: HttpClient) { }

  ngOnInit() {
    this.adminLoginService.getModels();
    this.adminLoginService.models.subscribe((data: Models[]) => {
      this.models = data;
    });
    this.adminLoginService.fetchDepartments();
    this.adminLoginService.departments.subscribe((data: Department[]) => {
      this.depts = data;
    });
    this.adminLoginService.semesters.subscribe((data: Semester[]) => {
      this.semesters = data;
    });
    this.adminLoginService.subjects.subscribe((data: Subjects[]) => {
      this.subjects = data;
    });
    this.adminLoginService.subjectData.subscribe(
      (data: {
        dept: number;
        marksType: Array<number>;
        moduleDetails: Array<string>;
        numberOfModules: number;
        sem: number;
        subId: number;
      }) => {
        this.paperSpecification.numberOfModules = data.numberOfModules;
        // console.log(this.numberOfModules);
        this.marksList = new Array(this.paperSpecification.numberOfModules);
        this.addUnitwiseDistribution();
      }
    );
    this.paperSpecification.difficulty = new Array(3);
    this.paperSpecification.cognitive = new Array(3);
  }

  onDepartmentSelected() {
    this.adminLoginService.fetchSemesters(this.paperSpecification.deptID);
  }
  onSemesterSelected() {
    this.adminLoginService.fetchSubjects(
      this.paperSpecification.deptID,
      this.paperSpecification.semNo
    );
  }

  onModelSelected() {
    this.modelDesc = this.models.filter(item => {
      return item._id === this.paperSpecification.modelID;
    })[0];
    let index = 0;
    let char = 'a';
    for (let i = 0; i < this.modelDesc.questionModelList.length; i++) {
      if (index === 0) {
        this.questionDesc = '<div class="card-body">';
        index++;
      }
      if (index === this.modelDesc.questionModelList[i].questionNumber) {
        this.questionDesc += this.modelDesc.questionModelList[i].questionNumber + '.' + char + '>  -  '
          + this.modelDesc.questionModelList[i].marks + ' Marks <br>';
          char = this.nextChar(char);
      } else {
        this.questionDesc += '</div>';
        if (this.modelDesc.questionModelList[i].questionNumber <= this.modelDesc.numberOfQuestions) {
          char = 'a';
          i--;
          index++;
          this.questionDesc += '<div class="card-body">';
        }
      }
    }
  }
  nextChar(c: string) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }

  onSubjectSelected() {
    this.adminLoginService.getSubjectData(this.paperSpecification.subID);
  }

  addUnitwiseDistribution() {
    this.paperSpecification.unitwiseDistribution = new Array(
      this.paperSpecification.numberOfModules
    );
    for (let i = 1; i <= this.paperSpecification.numberOfModules; i++) {
      this.marksList[i - 1] = i;
    }
    // console.log(this.marksList);
  }

  onSubmit() {
    // validating marks
    let sumOfMarks = 0;
    for (let i = 0; i < this.paperSpecification.numberOfModules; i++) {
      sumOfMarks += this.paperSpecification.unitwiseDistribution[i];
    }
    if (sumOfMarks !== this.modelDesc.totalMarks) {
      document.getElementById('marksError').innerText =
        'Sum of marks of Unitwise distribution must be equal to ' +
        this.modelDesc.totalMarks;
      this.clearFunction();
      return;
    }
    sumOfMarks = 0;
    for (let i = 0; i < this.paperSpecification.difficulty.length; i++) {
      sumOfMarks += this.paperSpecification.difficulty[i];
    }
    if (sumOfMarks !== this.modelDesc.totalMarks) {
      document.getElementById('diffError').innerText =
        'Sum of marks of difficulty level must be equal to ' +
        this.modelDesc.totalMarks;
      this.clearFunction();
      return;
    }
    sumOfMarks = 0;
    for (let i = 0; i < this.paperSpecification.cognitive.length; i++) {
      sumOfMarks += this.paperSpecification.cognitive[i];
    }
    if (sumOfMarks !== this.modelDesc.totalMarks) {
      document.getElementById('cogError').innerText =
        'Sum of marks of congitive level must be equal to ' +
        this.modelDesc.totalMarks;
      this.clearFunction();
      return;
    }
    console.log(this.paperSpecification);
    this.http.post('http://localhost:3000/admin/homepage/generatePaper', this.paperSpecification).subscribe(() => {
    });
  }
  clearFunction() {
    setTimeout(() => {
      document.getElementById('marksError').innerText = '';
      document.getElementById('diffError').innerText = '';
      document.getElementById('cogError').innerText = '';
    }, 3000);
  }
}
