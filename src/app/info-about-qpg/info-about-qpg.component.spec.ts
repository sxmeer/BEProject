import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAboutQPGComponent } from './info-about-qpg.component';

describe('InfoAboutQPGComponent', () => {
  let component: InfoAboutQPGComponent;
  let fixture: ComponentFixture<InfoAboutQPGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAboutQPGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAboutQPGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
