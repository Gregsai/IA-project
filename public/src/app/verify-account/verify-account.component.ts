import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {
  email: string = '';
  isEmailSent: boolean = true; // Indique si l'e-mail a été envoyé avec succès

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email'];
      this.callConfirmationEmailAPI(); // Appeler la fonction pour envoyer la confirmation par e-mail
    });
  }

  callConfirmationEmailAPI(): void {
    // Faire une requête HTTP vers votre API sur le port 3000 pour envoyer la confirmation par e-mail
    this.http.post<any>('http://localhost:3000/auth/sendConfirmationEmail', { email: this.email })
      .subscribe(
        (response) => {
          console.log('Confirmation email sent:', response);
          // Gérez la réponse de l'API si nécessaire
        },
        (error) => {
          console.error('Error sending confirmation email:', error);
          // Gérez les erreurs de l'API si nécessaire
        }
      );
  }

  resendEmail(): void {
    this.callConfirmationEmailAPI(); // Appeler la fonction pour renvoyer l'e-mail de confirmation
    this.isEmailSent = true; // Mettre à jour avec la logique réelle
  }

  // Fonction pour retourner à la page d'accueil
  navigateToHome(): void {
    // Code pour rediriger vers la page d'accueil
  }
}
