import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent {
  email: string = '';
  isEmailSent: boolean = true; // Indique si l'e-mail a été envoyé avec succès

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.email = params['email'];
    });
  }

  resendEmail(): void {
    // Logique pour renvoyer l'e-mail
    // Mettre à jour isEmailSent après avoir envoyé l'e-mail avec succès
    this.isEmailSent = true; // Mettre à jour avec la logique réelle
  }

  // Fonction pour retourner à la page d'accueil
  navigateToHome(): void {
    // Code pour rediriger vers la page d'accueil
  }
}
