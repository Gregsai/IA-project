import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'] // Utilisation de styleUrls au lieu de styleUrl pour spécifier le chemin du fichier CSS
})
export class SignUpComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  signUp() {
    const signUpData={
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }

    this.authService.signUp(signUpData).subscribe(
      (response) => {
        localStorage.setItem('tempEmail', this.email);
        this.router.navigateByUrl(`/verify-account/${this.email}/send-email`, { replaceUrl: true });
      },
      (error) => {
        console.error('Erreur lors de l\'inscription :', error);
      }
    );
  }
}
