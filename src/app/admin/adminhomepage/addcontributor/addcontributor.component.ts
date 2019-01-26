import { Component, OnInit } from '@angular/core';
import { AdminloginserviceService } from '../../adminloginservice.service';

@Component({
  selector: 'app-addcontributor',
  templateUrl: './addcontributor.component.html',
  styleUrls: ['./addcontributor.component.css']
})
export class AddcontributorComponent implements OnInit {
  selectedContributor = {
    id: '',
    name: '',
    password: '',
    password2: '',
    subjectsAssigned: ''
  };
  constructor(private adminloginservice: AdminloginserviceService) {
  }
  ngOnInit() {
  }
  onSubmit() {
    this.adminloginservice.postContributor(this.selectedContributor).subscribe((res) => {
      alert(res);
    });
  }
}
