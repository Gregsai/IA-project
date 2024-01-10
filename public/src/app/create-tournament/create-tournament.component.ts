import { Component } from '@angular/core';
import { CreateTournamentService } from '../create-tournament.service';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.css']
})
export class CreateTournamentComponent {
  tournamentName: string = '';
  discipline: string = '';
  seedingType: string = '';
  dateTime: string = '';
  address: string = '';
  participantLimit: number | null = null;
  registrationDeadline: string = '';
  sponsors: { name: string, link: string, imageLink: string }[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  disableButton: boolean = false;

  constructor(
    private createTournamentService : CreateTournamentService) {
  }

  addSponsor(): void {
    this.sponsors.push({ name: '', link: '', imageLink: '' });
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
        this.showError = true;
        this.errorMessage = "";
      }, 5000);
      return;
    }
    const tournamentData = {
      name: this.tournamentName,
      discipline: this.discipline,
      seedingType: this.seedingType,
      dateTime: this.dateTime,
      address: this.address,
      participantLimit: this.participantLimit,
      registrationDeadline: this.registrationDeadline,
      sponsors: this.sponsors,
    };
    console.log("tournament name: " + this.tournamentName);
    console.log("discipline: " + this.discipline);
    console.log("seeding type: " + this.seedingType);
    console.log("date time: " + this.dateTime);
    console.log("address: " + this.address);
    console.log("participant limit: " + this.participantLimit);
    console.log("registration deadline: " + this.registrationDeadline);
    console.log("sponsors: " + this.sponsors);

    this.createTournamentService.createTournament(tournamentData).subscribe(
      (response: any) => {
        console.log("response: " + response);
        this.showError = false;
        this.errorMessage = '';
      },
      (error) => {
        console.error('Error while creating tournament:', error);
        this.showError = true;
        this.errorMessage = 'Error while creating tournament.';
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
    if (date < currentDate) {
      this.showError = true;
      this.errorMessage = 'Please select a date in the future for the tournament and the application deadline';
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
    this.validateDate(this.registrationDeadline);
    this.validateAddress(this.address);
    this.validateDate(this.dateTime);
    this.validateSeeding(this.seedingType);
    this.validateDiscipline(this.discipline);
    this.validateName(this.tournamentName);
  }
}
