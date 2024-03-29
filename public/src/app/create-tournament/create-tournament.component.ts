import { Component, OnInit } from '@angular/core';
import { CreateTournamentService } from '../create-tournament.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.css']
})
export class CreateTournamentComponent implements OnInit {
  name: string = '';
  discipline: string = '';
  seedingType: string = '';
  date: string = '';
  address: string = '';
  maxParticipants: number | null = null;
  applicationDeadline: string = '';
  sponsors: { name: string, url: string, imageurl: string }[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  disableButton: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private createTournamentService : CreateTournamentService,
    private router: Router,
    private authService: AuthenticationService
    ) {
  }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.authService.setRedirectUrl(`/create-tournament`);
        this.router.navigateByUrl('/sign-in',{ replaceUrl: true });
      }
    });
  }
  addSponsor(): void {
    this.sponsors.push({ name: '', url: '', imageurl: '' });
  }

  removeSponsor(index: number): void {
    this.sponsors.splice(index, 1);
  }

  createTournament(): void {
    this.validateFields();
    if (this.errorMessage) {
      this.disableButton = true;
      this.showError = true;
      setTimeout(() => {
        this.disableButton = false;
        this.showError = false;
        this.errorMessage = "";
      }, 5000);
      return;
    }
    const tournamentData = {
      name: this.name,
      discipline: this.discipline,
      date: this.date,
      maxParticipants: this.maxParticipants,
      applicationDeadline: this.applicationDeadline,
      address: this.address,
      seedingType: this.seedingType,
      sponsors: this.sponsors,
    };
    this.createTournamentService.createTournament(tournamentData).subscribe(
      (response: any) => {
        console.log("response: " + response);
        this.disableButton = true;
        this.errorMessage = 'Tournament created successfully';
        this.showError = true;
        setTimeout(() => {
          this.disableButton = false;
          this.showError = false;
          this.errorMessage = "";
          this.router.navigateByUrl('/my-tournaments', { replaceUrl: true });
        }, 5000);
        return;
      },
      (error) => {
        console.error('Error while creating tournament:', error);
        this.errorMessage = 'Error while creating tournament';
        this.disableButton = true;
        this.showError = true;
        setTimeout(() => {
          this.disableButton = false;
          this.showError = false;
          this.errorMessage = "";
        }, 5000);
        return;
      }
    );
  }

  validateDate(date: string): void {
    if (!date) {
      this.showError = true;
      this.errorMessage = 'Please select a date.';
      return;
    }

    const currentDate = new Date().toISOString();
    console.log("date: " + currentDate)

    const userDate = new Date(date);
    const userCurrentDate = new Date();
    if (userDate < userCurrentDate) {
      this.showError = true;
      this.errorMessage = 'Please select a date in the future for the tournament';
      return;
    }
  }

  validateDeadline(date: string, deadline: string): void {
    if (!deadline) {
      this.showError = true;
      this.errorMessage = 'Please select a deadline.';
      return;
    }

    const currentDate = new Date().toISOString();
    const userDeadline = new Date(deadline);
    const userCurrentDate = new Date();

    if (userDeadline < userCurrentDate) {
      this.showError = true;
      this.errorMessage = 'Please select a deadline in the future for application deadline';
      return;
    }

    const userTournamentDate = new Date(date);
    if (userTournamentDate < userDeadline) {
      this.showError = true;
      this.errorMessage = 'Please select a deadline that is before the tournament date';
      return;
    }
  }

  validateName(name: string): void {
    if (!name) {
      this.showError = true;
      this.errorMessage = 'Please enter a tournament name.';
      return;
    }
  }

  validateDiscipline(name: string): void {
    if (!name) {
      this.showError = true;
      this.errorMessage = 'Please enter a discipline.';
      return;
    }
  }

  validateSeeding(name: string): void {
    if (!name) {
      this.showError = true;
      this.errorMessage = 'Please select a seeding type.';
      return;
    }
  }

  validateAddress(name: string): void {
    if (!name) {
      this.showError = true;
      this.errorMessage = 'Please enter an address.';
      return;
    }
  }

  validateFields(){
    this.validateDeadline(this.date, this.applicationDeadline);
    this.validateAddress(this.address);
    this.validateDate(this.date);
    this.validateSeeding(this.seedingType);
    this.validateDiscipline(this.discipline);
    this.validateName(this.name);
  }
}
