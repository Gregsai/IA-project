import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html',
  styleUrl: './password-forgotten.component.css'
})
export class PasswordForgottenComponent {
  email: string = '';
  showMessage: boolean = false;
  disableButton: boolean = false;
  errorMessage: string = '';
  displayErrorMessage: boolean = true;

  constructor(
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    history.replaceState({}, '', '/');
  }

  resetPassword() {

    this.disableButton = true;
    setTimeout(() => {
      this.disableButton = false;
    }, 5000);

    const resetPasswordData = {
      email: this.email
    }
    if(!this.authenticationService.validateEmailFormat(this.email)){
      this.errorMessage = 'Please enter a valid email (eg.. john.doe@gmail.com)';
    }
    else if (!this.authenticationService.emailAlreadyExists(this.email)){
      this.errorMessage = 'This email is not affiliated with any account';
    }

    if(this.errorMessage !== ''){
      this.displayErrorMessage = true;
      setTimeout(() => {
        this.displayErrorMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }

    this.authenticationService.sendResetPasswordEmail(this.email)
    .subscribe(
      (response) => {
        console.log('Password reset email sent:', response);
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 5000);
      },
      (error) => {
        console.error('Error sending password reset email:', error);
        this.errorMessage = error.message;
        this.displayErrorMessage = true;
        setTimeout(() => {
          this.displayErrorMessage = false;
          this.errorMessage = '';
        }, 5000);
      }
    );
  }
}
