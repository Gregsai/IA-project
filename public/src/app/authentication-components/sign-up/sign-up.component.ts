import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  displayErrorMessage: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  signUp() {
    const signUpData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    if (!this.authenticationService.validateFirstNameFormat(this.firstName)) {
      this.errorMessage = 'Please enter a valid first name (non null)';
    } else if (!this.authenticationService.validateLastNameFormat(this.lastName)) {
      this.errorMessage = 'Please enter a valid last name (non null)';
    } else if (!this.authenticationService.validateEmailFormat(this.email)) {
      this.errorMessage = 'Please enter a valid email (e.g., john.doe@gmail.com)';
    } else if (!this.authenticationService.validatePasswordFormat(this.password)) {
      this.errorMessage = 'Please enter a valid password (at least 4 characters)';
    } else {
      this.authenticationService.emailAlreadyExists(this.email).subscribe(
        (response: any) => {
          if (response.exists && response.exists === true) {
            this.errorMessage = 'Email already exists';
            this.displayErrorMessage = true;
            setTimeout(() => {
              this.displayErrorMessage = false;
              this.errorMessage = '';
            }, 5000);
          } else {
            this.authenticationService.signUp(signUpData).subscribe(
              (signUpResponse) => {
                this.router.navigateByUrl(`/verify-account/${this.email}/send-email`, { replaceUrl: true });
              },
              (signUpError) => {
                console.error('Error during sign up:', signUpError);
                this.errorMessage = signUpError.message;
                this.displayErrorMessage = true;
                setTimeout(() => {
                  this.displayErrorMessage = false;
                  this.errorMessage = '';
                }, 5000);
              }
            );
          }
        },
        (error) => {
          console.error('Error while checking email existence:', error);
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

  redirectToSignIn(event: Event){
    event.preventDefault();
    this.router.navigateByUrl('/sign-in', { replaceUrl: true });
  }
}
