import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Status } from './status.model';

@Injectable({
  providedIn: 'root'
})
export class ContributorloginserviceService {
  authenticated:boolean = false;
  name: string;
  private token: string;
  private id: string;
  private subjectsAssigned:string;
  authStatus = new Subject<Boolean>();
  public statusUpdate = new Subject<{ status: Status }>();
  public userName = new Subject<string>();
  readonly baseURL = 'http://localhost:3000/contributors/login';
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getAuthentication(){
    return this.authenticated;
  }
  getAuthStatus() {
    return this.authStatus.asObservable();
  }
  getid(){
    return this.id;
  }
  getSubjectsAssigned(){
    return this.subjectsAssigned;
  }
  loginUser(user) {
    console.log(user);
    this.http.post<{ token: string, id:string, name:string, subjectsAssigned:string }>(this.baseURL, user)
      .subscribe((response) => {
        console.log(response);
        const token = response.token;
        this.token = token;
        this.name = response.name;
        if (token) {
          console.log(response);
          this.id=response.id;
          this.userName.next(this.name);
          this.subjectsAssigned=response.subjectsAssigned;
          this.authenticated=true;
          this.authStatus.next(true);
          this.getSubjectStatus();
        }
      },
      (err) => {
        alert('no such user');
    });
  }

  getSubjectStatus() {
    this.http.get<{status: Status}>('http://localhost:3000/contributors/getSubjectStatus?subjectID='+this.subjectsAssigned).subscribe(data => {
      this.statusUpdate.next(data);
    });
  }
  logout() {
    this.token = null;
    this.authenticated=false;
    this.authStatus.next(false);
    this.router.navigate(['/']);
  }
}
