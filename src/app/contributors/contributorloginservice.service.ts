import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContributorloginserviceService {
  private token: string;
  authStatus = new Subject<Boolean>();
  readonly baseURL = 'http://localhost:3000/contributors/login';
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getAuthStatus() {
    return this.authStatus.asObservable();
  }
  loginUser(user) {
    console.log(user);
    this.http.post<{ token: string }>(this.baseURL, user)
      .subscribe((response) => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          this.authStatus.next(true);
        }
      },
        (err) => {
          alert("no such user");
        })
  }
  logout() {
    this.token = null;
    this.authStatus.next(false);
    this.router.navigate(['/']);
  }
}
