import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'public';
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}
  goToMyTournaments() {
    if (!this.authService.isLoggedIn()) {
      // Si l'utilisateur n'est pas connecté, enregistrer l'URL actuelle pour la redirection après la connexion
      this.authService.setRedirectUrl('/my-tournaments');
      // Rediriger vers la page de connexion
      this.router.navigateByUrl('/sign-in');
    } else {
      // Si l'utilisateur est déjà connecté, rediriger directement vers 'my-tournaments'
      this.router.navigateByUrl('/my-tournaments');
    }
  }
}
