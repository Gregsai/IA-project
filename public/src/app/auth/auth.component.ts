import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  userLoggedIn: boolean = false;
  authState: string = 'sign-in'
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  /**
  loggedIn: boolean = false;
  userEmail: string = '';
  message: string = '';
  signUpError: string = '';
  signInError: string = '';
  showSignUp: boolean = false;
  status: string = '';
  */


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
    ) {}

    signUp(): void {
      const signUpData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      };

      this.http.post('http://localhost:3000/auth/signUp', signUpData)
        .subscribe(
          (response) => {
            console.log('Inscription réussie :', response);
            this.router.navigate(['/verifyAccount', this.email]);
          },
          (error) => {
            console.error('Erreur lors de l\'inscription :', error);
          }
        );
    }

  signIn():void{}
  forgotPassword():void{}
  logOut():void{}
}
