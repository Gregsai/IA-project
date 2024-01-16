import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { TournamentsService } from '../tournaments.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.css']
})
export class ParticipateComponent implements OnInit {

  isLoggedIn: boolean = false;
  errorMessage: string = '';
  displayErrorMessage: boolean = false;
  disableButton: boolean = false;
  tournamentId: string = "";
  ranking: number = 0;
  licenceNumber: number = 0;
  message: string = "";
  showMessage: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private tournamentsService: TournamentsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authenticationService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (!this.isLoggedIn) {
        this.router.navigateByUrl('/sign-in');
      }
    });

    this.route.paramMap.subscribe(params => {
      this.tournamentId = params.get('id') ?? '';
      if (this.tournamentId === '') {
        this.router.navigate([this.authenticationService.getRedirectUrl()]);
      }
    });
  }

  getIntoTournament() {
    if (this.licenceNumber === 0) {
      console.error('Licence number is required.');
      this.errorMessage = 'Licence number is required.';
      this.displayErrorMessage = true;
      this.disableButton = true;

      setTimeout(() => {
        this.disableButton = false;
        this.displayErrorMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }

    this.tournamentsService.getIntoTournament(this.tournamentId, this.licenceNumber, this.ranking)
      .subscribe(
        response => {
          console.log('Participation successful');
          this.message = "You are now participating in the tournament";
          this.showMessage = true;
          this.disableButton = true;
          setTimeout(() => {
            this.disableButton = false;
            this.showMessage = false;
            this.message = "";
            this.router.navigate([this.authenticationService.getRedirectUrl()]);
          }, 5000);
        },
        error => {
          console.error('Participation failed', error);
          this.errorMessage = error.error.message;
          this.displayErrorMessage = true;
          this.disableButton = true;

          setTimeout(() => {
            this.disableButton = false;
            this.displayErrorMessage = false;
            this.errorMessage = '';
          }, 5000);
        }
      );
  }

  redirectToTournamentDescription(event: Event) {
    event.preventDefault();
    const redirectUrl = this.authenticationService.getRedirectUrl();
    this.router.navigate([redirectUrl]);
  }
}
