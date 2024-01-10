import { Component } from '@angular/core';
import { CreateTournamentService } from '../create-tournament.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.css']
})
export class CreateTournamentComponent {
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

  constructor(
    private createTournamentService : CreateTournamentService,
    private router: Router,
    ) {
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
    if (date < currentDate) {
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
    if (deadline < currentDate) {
      this.showError = true;
      this.errorMessage = 'Please select a deadline in the future for application deadline';
      return;
    }
    if (date < deadline) {
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
