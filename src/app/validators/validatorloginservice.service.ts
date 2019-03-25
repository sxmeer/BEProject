import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Status } from '../contributors/status.model';

@Injectable({
  providedIn: 'root'
})
export class ValidatorloginserviceService {
  private name: string;
  private token: string;
  private id: string;
  authenticated:boolean=false;
  private subjectsAssigned:string;
  public statusUpdate = new Subject<{ status: Status }>();
  authStatus = new Subject<Boolean>();
  public userName = new Subject<string>();
  readonly baseURL = 'http://localhost:3000/validators/login';
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getAuthStatus() {
    return this.authStatus.asObservable();
  }
  getAuthentication(){
    return this.authenticated;
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
          this.getSubjectsAssigned();
        }
      },
        (err) => {
          alert('no such user');
        });
  }

  getSubjectStatus() {
    this.http.get<{status: Status}>('http://localhost:3000/validators/getSubjectStatus?subjectID='+this.subjectsAssigned).subscribe(data => {
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
