import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { AuthService } from '../authentication.service';
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
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

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

    resetParameters(): void {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';
    }

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
            if (this.closeBtn) {
              this.closeBtn.nativeElement.click();
            }
            localStorage.setItem('tempEmail', this.email);


            // Réinitialiser les paramètres avant la redirection
            // this.resetParameters();

            const email = (localStorage.getItem('tempEmail')|| "").replace(/\./g, '_');

            // Vérifier si l'email est disponible et rediriger vers la route verifyAccount
            if (email) {
              // Utiliser window.location.href pour recharger la page avec la nouvelle URL
              window.location.href = `/verifyAccount/${email}`;
            }
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
