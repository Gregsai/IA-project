import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent {
  token: string = '';
  isVerified: boolean = false; // Indique si le compte a été vérifié avec succès
  showMessage: boolean = false; // Indique si le message de succès doit être affiché
  disableButton: boolean = false; // Indique si le bouton doit être désactivé

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    this.verifyAccount();
    history.replaceState({}, '', '/');
  }

  verifyAccount(): void {
    this.isVerified = true; // Marque la vérification du compte

    // Désactive le bouton pendant 5 secondes
    this.disableButton = true;
    setTimeout(() => {
      this.disableButton = false;
    }, 5000);

    // Envoie la requête HTTP pour vérifier le compte
    this.http.get<any>('http://localhost:3000/auth/verifyAccount/' + this.token)
      .subscribe(
        (response) => {
          console.log('Account verified:', response);
          // Affiche le message de succès après 5 secondes
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 5000);
        },
        (error) => {
          console.error('Error verifying account:', error);
          // Gérez les erreurs de l'API si nécessaire
        }
      );
  }

  navigateToHome(): void {
    this.router.navigateByUrl('', { replaceUrl: true });
    history.replaceState({}, '', '/');
  }
}
