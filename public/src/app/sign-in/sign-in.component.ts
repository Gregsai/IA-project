import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  displayErrorMessage: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ){

  }

  signIn() {
    const signInData = {
      email: this.email,
      password: this.password
    }
    if(!this.authenticationService.validateEmailFormat(this.email)){
      this.errorMessage = 'Please enter a valid email (eg.. john.doe@gmail.com)';
    }
    else if (!this.authenticationService.validatePasswordFormat(this.password)){
      this.errorMessage = 'Please enter a valid password (at least 4 characters)';
    }
    else if (!this.authenticationService.emailAlreadyExists(this.email)){
      this.errorMessage = 'This email is not affiliated with any account';
    }
    else if (!this.authenticationService.emailVerified(this.email)){
      this.errorMessage = 'Please verify your email';
      this.router.navigateByUrl(`/verify-account/${this.email}/send-email`, { replaceUrl: true });
    }

    this.authenticationService.signIn(signInData).subscribe(
      (response: any) => {
        if(response && response.token){
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', this.email);
          this.router.navigateByUrl('/home', { replaceUrl: true });
        }
      },
      (error) => {
        console.error('Erreur lors de la connexion :', error);
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
