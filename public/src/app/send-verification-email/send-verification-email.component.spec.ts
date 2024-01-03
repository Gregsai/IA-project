import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendVerificationEmailComponent } from './send-verification-email.component';

describe('SendVerificationEmailComponent', () => {
  let component: SendVerificationEmailComponent;
  let fixture: ComponentFixture<SendVerificationEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendVerificationEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendVerificationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
