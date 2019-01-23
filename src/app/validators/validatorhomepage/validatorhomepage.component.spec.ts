import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorhomepageComponent } from './validatorhomepage.component';

describe('ValidatorhomepageComponent', () => {
  let component: ValidatorhomepageComponent;
  let fixture: ComponentFixture<ValidatorhomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorhomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorhomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
