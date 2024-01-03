import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-send-verification-email',
  templateUrl: './send-verification-email.component.html',
  styleUrl: './send-verification-email.component.css'
})
export class SendVerificationEmailComponent implements OnInit {
  email: string = '';
  isEmailSent: boolean = false; // Indique si l'e-mail a été envoyé avec succès
  showMessage: boolean = false; // Indique si le message de succès doit être affiché
  disableButton: boolean = false; // Indique si le bouton doit être désactivé

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email'];
    });
    history.replaceState({}, '', '/');
  }

  sendEmail(): void {
    this.isEmailSent = true; // Marque l'envoi de l'e-mail

    // Désactive le bouton pendant 5 secondes
    this.disableButton = true;
    setTimeout(() => {
      this.disableButton = false;
    }, 5000);

    // Envoie la requête HTTP pour envoyer l'e-mail
    this.http.post<any>('http://localhost:3000/auth/sendConfirmationEmail', { email: this.email })
      .subscribe(
        (response) => {
          console.log('Confirmation email sent:', response);
          // Affiche le message de succès après 5 secondes
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 5000);
        },
        (error) => {
          console.error('Error sending confirmation email:', error);
          // Gérez les erreurs de l'API si nécessaire
        }
      );
  }

  navigateToHome(): void {
    this.router.navigateByUrl('', { replaceUrl: true });
    history.replaceState({}, '', '/');
  }
}
