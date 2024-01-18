import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledInTournamentsComponent } from './enrolled-in-tournaments.component';

describe('EnrolledInTournamentsComponent', () => {
  let component: EnrolledInTournamentsComponent;
  let fixture: ComponentFixture<EnrolledInTournamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrolledInTournamentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrolledInTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
