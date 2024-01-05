import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
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
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    history.replaceState({}, '', '/reset-password');
  }

  resetPassword() {
    this.disableButton = true;
    setTimeout(() => {
      this.disableButton = false;
    }, 5000);

    this.validateEmail();
  }

  validateEmail(): void {
    if (!this.authenticationService.validateEmailFormat(this.email)) {
      this.handleError('Please enter a valid email (eg.. john.doe@gmail.com)');
    } else {
      this.checkEmailExists();
    }
  }

  checkEmailExists(): void {
    this.authenticationService.emailAlreadyExists(this.email).subscribe(
      (response: any) => {
        if (!response.exists) {
          this.handleError('This email is not affiliated with any account');
        } else {
          this.sendResetPasswordEmail();
        }
      },
      (error) => {
        console.error('Error while checking email existence:', error);
        this.handleError('Error while checking email existence.');
      }
    );
  }

  sendResetPasswordEmail(): void {
    this.authenticationService.sendResetPasswordEmail(this.email).subscribe(
      () => {
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 5000);
      },
      (error) => {
        this.handleError(error.message);
      }
    );
  }

  handleError(errorMessage: string): void {
    this.errorMessage = errorMessage;
    this.displayErrorMessage = true;
    setTimeout(() => {
      this.displayErrorMessage = false;
      this.errorMessage = '';
    }, 5000);
  }

  redirectToSignIn(event: Event): void {
    event.preventDefault();
    this.router.navigateByUrl('/sign-in', { replaceUrl: true });
  }
}
