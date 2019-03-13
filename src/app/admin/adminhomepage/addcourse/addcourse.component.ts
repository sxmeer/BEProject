import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';
import { Department } from '../../department.model';
import { Semester } from '../../semesters.model';
import { Subjects } from '../../subjects.model';

@Component({
  selector: 'app-addcourse',
  templateUrl: './addcourse.component.html',
})
export class AddcourseComponent implements OnInit {
  list = [];
  course = {
    // subName: '',
    subId: 0,
    sem: 0,
    dept: '',
    marksType: '',
    numberOfModules: 0,
    moduleDetails: []
  };
  public depts: Department[];
  public semesters: Semester[];
  public subjects: Subjects[];
  constructor(private adminloginservice: AdminloginserviceService) { }

  ngOnInit() {
    this.adminloginservice.fetchDepartments();
    this.adminloginservice.departments.subscribe((data: Department[])=> {
      this.depts = data;
    });
    this.adminloginservice.semesters.subscribe((data: Semester[]) => {
      this.semesters = data;
    });
    this.adminloginservice.subjects.subscribe((data: Subjects[]) => {
      this.subjects = data;
    })
  }
  onDepartmentSelected() {
    this.adminloginservice.fetchSemesters(this.course.dept);
  }
  onSemesterSelected() {
    this.adminloginservice.fetchSubjects( this.course.dept, this.course.sem);
  }
  addModule() {
    this.list = [];
    this.course.moduleDetails = new Array(this.course.numberOfModules);
    for (let i = 1; i <= this.course.numberOfModules; i++) {
      this.list.push(i);
    }
  }
  onSubmit() {
    // alert(JSON.stringify(this.course, undefined, 2));
    this.adminloginservice.postCourses(this.course).subscribe((res) => {
      console.log(JSON.stringify(res, undefined, 2));
    });
  }
}
