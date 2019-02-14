import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContributoraddquestionserviceService } from '../../contributoraddquestionservice.service';
import { ContributorloginserviceService } from '../../contributorloginservice.service';
import { HttpClient } from '@angular/common/http';
import { ContributordataService } from '../../contributordata.service';

@Component({
  selector: 'app-contributormoduledescription',
  templateUrl: './contributormoduledescription.component.html',
  styleUrls: ['./contributormoduledescription.component.css']
})
export class ContributormoduledescriptionComponent implements OnInit {
  constructor(private http: HttpClient, private data: ContributordataService) { }
  subjectDetail;
  ngOnInit() {
    this.data.subjectData.subscribe(data => {
      this.subjectDetail = data;
      console.log(data);
    });
    this.data.getData();
  }

  // ngOnDestroy() {
  //   this.data.subjectData.unsubscribe();
  // }
}
