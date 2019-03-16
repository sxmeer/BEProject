import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValidatordataService } from '../../validatordata.service';

@Component({
  selector: 'app-validatormoduledescription',
  templateUrl: './validatormoduledescription.component.html',
  styleUrls: ['./validatormoduledescription.component.css']
})
export class ValidatormoduledescriptionComponent implements OnInit {
  constructor(private http: HttpClient, private data: ValidatordataService) { }
  subjectDetail;
  ngOnInit() {
    this.data.subjectData.subscribe(data => {
      this.subjectDetail = data;
      console.log(data);
    });
    this.data.getData();
  }
}
