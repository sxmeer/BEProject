import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorhomepageComponent } from './contributorhomepage.component';

describe('ContributorhomepageComponent', () => {
  let component: ContributorhomepageComponent;
  let fixture: ComponentFixture<ContributorhomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorhomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorhomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
