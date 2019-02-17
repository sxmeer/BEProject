import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminloginserviceService {
  authenticated = false;
  private token: string;
  authStatus = new Subject<Boolean>();
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
}
