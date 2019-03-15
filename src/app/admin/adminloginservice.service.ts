import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Department } from './department.model';
import { Subjects } from './subjects.model';
import { Semester } from './semesters.model';
import { Models } from './models.model';

@Injectable({
  providedIn: 'root'
})
export class AdminloginserviceService {
  authenticated = false;
  private token: string;
  // public models: Models[];
  authStatus = new Subject<Boolean>();
  public departments = new Subject<Department[]>();
  public semesters = new Subject<Semester[]>();
  public subjects = new Subject<Subjects[]>();
  public models = new Subject<Models[]>();
  public subjectData = new Subject();
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getAuthentication() {
    return this.authenticated;
  }
  getAuthStatus() {
    return this.authStatus.asObservable();
  }
  postValidator(validators) {
    return this.http.post('http://localhost:3000/admin/homepage/addvalidators', validators);
  }
  postContributor(contributors) {
    return this.http.post('http://localhost:3000/admin/homepage/addcontributors', contributors);
  }
  postCourses(courseDetails) {
    return this.http.post('http://localhost:3000/admin/homepage/addcourses', courseDetails);
  }
  postModel(ModelDetail){
    console.log("service hit");
     this.http.post<{message: String}>('http://localhost:3000/admin/homepage/addmodel', ModelDetail).subscribe(data => {
       console.log(data);
       alert(data.message);
     });
  }
  getContributors(){
    this.http.get('http://localhost:3000/admin/homepage/getContributors').subscribe((data)=>{
        console.log(data);
    })
  }
  loginUser(user) {
    console.log(user);
    this.http.post<{ token: string }>('http://localhost:3000/admin/login', user)
      .subscribe((response) => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          this.authenticated = true;
          this.authStatus.next(true);
        }
      },
      (err) => {
          alert('no such user');
      });

  }
  logout() {
    this.token = null;
    this.authenticated = false;
    this.authStatus.next(false);
    this.router.navigate(['/']);
  }

  // Call to fetch list of departments
  fetchDepartments() {
    this.http.get<Department[]>('http://localhost:3000/courses/departments').subscribe(data => {
      this.departments.next(data);
    });
  }

  fetchSemesters(deptID) {
    const queryParams = `?deptID=${deptID}`;
    this.http.get<Semester[]>('http://localhost:3000/courses/semesters' + queryParams).subscribe(data => {
      this.semesters.next(data);
    });
  }

  fetchSubjects(deptID, semNo) {
    const queryParams = `?deptID=${deptID}&semNo=${semNo}`;
    this.http.get<Subjects[]>('http://localhost:3000/courses/subjects' + queryParams).subscribe(data => {
      this.subjects.next(data);
    });
  }

  getModels() {
    this.http.get<Models[]>('http://localhost:3000/admin/homepage/getModels').subscribe(data => {
      this.models.next(data);
    });
  }

  getSubjectData(subID) {
    this.http.get('http://localhost:3000/admin/homepage/getSubjectData?subid='+subID).subscribe(data => {
      this.subjectData.next(data);
    });
  }
}
