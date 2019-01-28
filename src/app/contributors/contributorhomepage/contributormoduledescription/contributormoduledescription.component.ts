import { Component, OnInit } from '@angular/core';
import { ContributoraddquestionserviceService } from '../../contributoraddquestionservice.service';

@Component({
  selector: 'app-contributormoduledescription',
  templateUrl: './contributormoduledescription.component.html',
  styleUrls: ['./contributormoduledescription.component.css']
})
export class ContributormoduledescriptionComponent implements OnInit {

  constructor(private contributorAddQuestion:ContributoraddquestionserviceService) { }

  ngOnInit() {
  }

}
