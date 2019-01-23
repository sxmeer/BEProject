import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorloginComponent } from './validatorlogin.component';

describe('ValidatorloginComponent', () => {
  let component: ValidatorloginComponent;
  let fixture: ComponentFixture<ValidatorloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
