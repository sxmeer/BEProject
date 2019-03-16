import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidatorloginserviceService {
  private token: string;
  private id: string;
  authenticated:boolean=false;
  private subjectsAssigned:string;
  authStatus = new Subject<Boolean>();
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
    this.http.post<{ token: string, id:string, subjectsAssigned:string }>(this.baseURL, user)
      .subscribe((response) => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          console.log(response);
          this.id=response.id;
          this.subjectsAssigned=response.subjectsAssigned;
          this.authenticated=true;
          this.authStatus.next(true);
        }
      },
        (err) => {
          alert('no such user');
        });
  }
  logout() {
    this.token = null;
    this.authenticated=false;
    this.authStatus.next(false);
    this.router.navigate(['/']);
  }
}
