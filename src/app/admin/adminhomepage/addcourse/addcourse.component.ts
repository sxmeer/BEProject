import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';

@Component({
  selector: 'app-addcourse',
  templateUrl: './addcourse.component.html',
})
export class AddcourseComponent implements OnInit {
  list = [];
  course = {
    subName: "",
    subId:0,
    sem:0,
    dept:"",
    marksType: "",
    numberOfModules: 0,
    moduleDetails: []
  }
  constructor(private adminloginservice:AdminloginserviceService) { }

  ngOnInit() {
  }
  addModule() {
    this.list = [];
    this.course.moduleDetails = new Array(this.course.numberOfModules);
    for (var i = 1; i <= this.course.numberOfModules; i++) {
      this.list.push(i);
    }
  }
  onSubmit() {
    this.adminloginservice.postCourses(this.course).subscribe((res) => {
      console.log(JSON.stringify(res, undefined, 2));
    })
  }
}
