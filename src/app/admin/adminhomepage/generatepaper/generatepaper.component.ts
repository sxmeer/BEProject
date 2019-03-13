import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';
import { Models } from '../../models.model';
import { Department } from '../../department.model';
import { Semester } from '../../semesters.model';
import { Subjects } from '../../subjects.model';

@Component({
  selector: 'app-generatepaper',
  templateUrl: './generatepaper.component.html',
  styleUrls: ['./generatepaper.component.css']
})
export class GeneratepaperComponent implements OnInit {

  models: Models[];
  modelDesc: Models[];
  questionDesc;
  public paperSpecification = {
    modelID: '',
    deptID: 0,
    semNo: 0,
    subID: 0
  };

  public depts: Department[];
  public semesters: Semester[];
  public subjects: Subjects[];

  constructor(private adminLoginService: AdminloginserviceService) { }

  ngOnInit() {
    this.adminLoginService.getModels();
    this.adminLoginService.models.subscribe((data: Models[]) => {
      this.models = data;
    });
    this.adminLoginService.fetchDepartments();
    this.adminLoginService.departments.subscribe((data: Department[])=> {
      this.depts = data;
    });
    this.adminLoginService.semesters.subscribe((data: Semester[]) => {
      this.semesters = data;
    });
    this.adminLoginService.subjects.subscribe((data: Subjects[]) => {
      this.subjects = data;
    });
  }

  onDepartmentSelected() {
    this.adminLoginService.fetchSemesters(this.paperSpecification.deptID);
  }
  onSemesterSelected() {
    this.adminLoginService.fetchSubjects( this.paperSpecification.deptID, this.paperSpecification.semNo);
  }

  onModelSelected() {
    this.modelDesc = this.models.filter((item) => {
      return item._id === this.paperSpecification.modelID;
    });
    this.questionDesc = JSON.stringify(this.modelDesc[0].questionModelList);
  }

  onSubmit() {

  }

}
