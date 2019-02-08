import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ContributorloginserviceService } from './contributorloginservice.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributordataService {

  constructor(private loginService: ContributorloginserviceService, private http:HttpClient) { }
  subjectData = new Subject();
  getData(){
    let params = new HttpParams().set("id",this.loginService.getSubjectsAssigned());
    this.http.get('http://localhost:3000/contributors/courseDetail',{params}).subscribe((data)=>{
        this.subjectData.next(data);
    })
  }
}
