import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
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
    const signUpData={
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }
    if(!this.authenticationService.validateEmailFormat(this.email)){
      this.errorMessage = 'Please enter a valid email (eg.. john.doe@gmail.com)';
    }
    else if (!this.authenticationService.validatePasswordFormat(this.password)){
      this.errorMessage = 'Please enter a valid password (at least 4 characters)';
    }
    else if (this.authenticationService.emailAlreadyExists(this.email)){
      this.errorMessage = 'This email is already affiliated with an account';
    }

    if(this.errorMessage !== ''){
      this.displayErrorMessage = true;
      setTimeout(() => {
        this.displayErrorMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }

    this.authenticationService.signUp(signUpData).subscribe(
      (response) => {
        localStorage.setItem('tempEmail', this.email);
        this.router.navigateByUrl(`/verify-account/${this.email}/send-email`, { replaceUrl: true });
      },
      (error) => {
        console.error('Erreur lors de l\'inscription :', error);
        this.errorMessage = error.message;
      }
    );

    if(this.errorMessage !== ''){
      this.displayErrorMessage = true;
      setTimeout(() => {
        this.displayErrorMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }

  }
}
