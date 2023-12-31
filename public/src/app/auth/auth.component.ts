import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  loggedIn: boolean = false;
  userEmail: string = '';
  message: string = '';

  constructor(private authService: AuthService) {}

  register(): void {
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.authService.registerUser(userData).subscribe(
      (response) => {
        console.log(response); // Gérer la réponse réussie, par exemple rediriger vers une page de confirmation
        this.message = 'Inscription réussie. Veuillez vous connecter.';
      },
      (error) => {
        console.error(error); // Gérer l'erreur, par exemple afficher un message à l'utilisateur
        this.message = 'Erreur lors de l\'inscription.';
      }
    );
  }

  login(): void {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.authService.loginUser(credentials).subscribe(
      (response) => {
        console.log(response); // Gérer la réponse réussie, par exemple stocker le token JWT côté client
        this.loggedIn = true;
        this.userEmail = this.email;
        this.message = 'Connexion réussie.';
      },
      (error) => {
        console.error(error); // Gérer l'erreur, par exemple afficher un message à l'utilisateur
        this.message = 'Adresse e-mail ou mot de passe incorrect.';
      }
    );
  }

  logout(): void {
    this.authService.logoutUser().subscribe(
      (response) => {
        console.log(response); // Gérer la réponse réussie, par exemple rediriger vers la page d'accueil
        this.loggedIn = false;
        this.userEmail = '';
        this.message = 'Déconnexion réussie.';
      },
      (error) => {
        console.error(error); // Gérer l'erreur, par exemple afficher un message à l'utilisateur
        this.message = 'Erreur lors de la déconnexion.';
      }
    );
  }

  forgotPassword(): void {
    console.log(this.userEmail);
    this.authService.forgotPassword("gregory.sailly26@gmail.com").subscribe(
      (response) => {
        console.log(response); // Gérer la réponse réussie, par exemple afficher un message à l'utilisateur
        this.message = 'Un e-mail de réinitialisation vous a été envoyé.';
      },
      (error) => {
        console.error(error); // Gérer l'erreur, par exemple afficher un message à l'utilisateur
        this.message = 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation.';
      }
    );
  }
}
