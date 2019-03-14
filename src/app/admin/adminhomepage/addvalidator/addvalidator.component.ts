import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';
import { Subjects } from '../../subjects.model';
import { Semester } from '../../semesters.model';
import { Department } from '../../department.model';

@Component({
  selector: 'app-addvalidator',
  templateUrl: './addvalidator.component.html',
  styleUrls: ['./addvalidator.component.css']
})
export class AddvalidatorComponent implements OnInit {
  public depts: Department[];
  public semesters: Semester[];
  public subjects: Subjects[];
  selectedValidator = {
    // id: '',
    name: '',
    subId: 0,
    sem: 0,
    dept: '',
    // password: '',
    // password2: '',
    email: '',
    // subjectsAssigned: ''
  };
  constructor(private adminLoginService: AdminloginserviceService) { }

  ngOnInit() {
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
  onSubmit() {
    this.adminLoginService.postValidator(this.selectedValidator).subscribe((res) => {
      alert(res);
    },
    (err)=>{
      alert(err);
    });
    // console.log(this.selectedValidator);
  }
  onDepartmentSelected() {
    this.adminLoginService.fetchSemesters(this.selectedValidator.dept);
  }
  onSemesterSelected() {
    this.adminLoginService.fetchSubjects( this.selectedValidator.dept, this.selectedValidator.sem);
  }
}
