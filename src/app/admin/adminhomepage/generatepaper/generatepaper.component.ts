import { Component, OnInit } from "@angular/core";
import { AdminloginserviceService } from "../../adminloginservice.service";
import { Models } from "../../models.model";
import { Department } from "../../department.model";
import { Semester } from "../../semesters.model";
import { Subjects } from "../../subjects.model";

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

  constructor(private adminLoginService: AdminloginserviceService) {}

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
    this.questionDesc = JSON.stringify(
      this.modelDesc.questionModelList,
      undefined,
      2
    );
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
      document.getElementById("marksError").innerText =
        "Sum of marks of Unitwise distribution must be equal to " +
        this.modelDesc.totalMarks;
        this.clearFunction();
      return;
    }
    sumOfMarks = 0;
    for (let i = 0; i < this.paperSpecification.difficulty.length; i++) {
      sumOfMarks += this.paperSpecification.difficulty[i];
    }
    if (sumOfMarks !== this.modelDesc.totalMarks) {
      document.getElementById("diffError").innerText =
        "Sum of marks of difficulty level must be equal to " +
        this.modelDesc.totalMarks;
        this.clearFunction();
      return;
    }
    sumOfMarks = 0;
    for (let i = 0; i < this.paperSpecification.cognitive.length; i++) {
      sumOfMarks += this.paperSpecification.cognitive[i];
    }
    if (sumOfMarks !== this.modelDesc.totalMarks) {
      document.getElementById("cogError").innerText =
        "Sum of marks of congitive level must be equal to " +
        this.modelDesc.totalMarks;
        this.clearFunction();
      return;
    }
    console.log(this.paperSpecification);
  }
  clearFunction(){
    setTimeout(() => {
      document.getElementById("marksError").innerText = "";
      document.getElementById("diffError").innerText = "";
      document.getElementById("cogError").innerText = "";
    }, 3000);
  }
}
