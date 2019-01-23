import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorloginComponent } from './contributorlogin.component';

describe('ContributorloginComponent', () => {
  let component: ContributorloginComponent;
  let fixture: ComponentFixture<ContributorloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
