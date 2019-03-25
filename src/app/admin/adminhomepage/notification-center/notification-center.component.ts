import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';
import { Semester } from '../../semesters.model';
import { Subjects } from '../../subjects.model';
import { Department } from '../../department.model';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  public depts: Department[];
  public semesters: Semester[];
  public subjects: Subjects[];
  notificationDetail = {
    dept: 0,
    sem: 0,
    subId: 0,
    type: ''
  };
  buttonValue = '';
  subjectStatus;
  showButton = false;
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
    this.adminLoginService.statusUpdate.subscribe(data => {
      console.log(data);
      this.subjectStatus = data;
      this.diplayAppropriateFunction();
    })
  }

  onDepartmentSelected() {
    this.adminLoginService.fetchSemesters(this.notificationDetail.dept);
  }
  onSemesterSelected() {
    this.adminLoginService.fetchSubjects( this.notificationDetail.dept, this.notificationDetail.sem);
  }

  checkSubjectStatus() {
    this.adminLoginService.getSubjectStatus(this.notificationDetail.subId);
  }

  diplayAppropriateFunction() {
    this.showButton = true;
    if(this.subjectStatus !== null) {
      if (this.notificationDetail.type === 'contributor') {
        if(this.subjectStatus.contributor === 1) {
          this.buttonValue = 'Stop Contribution Phase';
        } else {
          this.buttonValue = 'Start Contribution Phase';
        }
      }
      if (this.notificationDetail.type === 'validator') {
        if(this.subjectStatus.validator === 1) {
          this.buttonValue = 'Stop Validation Phase';
        } else {
          this.buttonValue = 'Start Validation Phase';
        }
      }
    } else {
      if (this.notificationDetail.type === 'contributor') {
        this.buttonValue = 'Start Contribution Phase';
      } else if (this.notificationDetail.type === 'validator') {
        this.buttonValue = 'Start Validation Phase';
      }
    }
  }

  onSubmit() {
    if (this.subjectStatus === null) {

    }
  }

}
