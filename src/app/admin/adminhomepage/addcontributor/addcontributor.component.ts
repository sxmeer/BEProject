import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';
import { Department } from '../../department.model';
import { Semester } from '../../semesters.model';
import { Subjects } from '../../subjects.model';

@Component({
  selector: 'app-addcontributor',
  templateUrl: './addcontributor.component.html',
  styleUrls: ['./addcontributor.component.css']
})
export class AddcontributorComponent implements OnInit {
  selectedContributor = {
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
  public depts: Department[];
  public semesters: Semester[];
  public subjects: Subjects[];
  constructor(private adminloginservice: AdminloginserviceService) {
  }
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
    });
  }
  onSubmit() {
    this.adminloginservice.postContributor(this.selectedContributor).subscribe((res) => {
      alert(JSON.stringify(res));
    });
    console.log(this.selectedContributor);
  }

  onDepartmentSelected() {
    this.adminloginservice.fetchSemesters(this.selectedContributor.dept);
  }
  onSemesterSelected() {
    this.adminloginservice.fetchSubjects( this.selectedContributor.dept, this.selectedContributor.sem);
  }
}
