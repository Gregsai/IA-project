import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentsService } from '../tournaments.service';
import { CreateTournamentService } from '../create-tournament.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-edit-tournament',
  templateUrl: './edit-tournament.component.html',
  styleUrl: './edit-tournament.component.css'
})
export class EditTournamentComponent implements OnInit {
  tournamentId : string = '';
  tournamentData: any;
  tournamentSponsors: any;
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
  private redirectUrl: string = '/';

  constructor(
    private route: ActivatedRoute,
    private tournamentsService: TournamentsService,
    private createTournamentService : CreateTournamentService,
    private authService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.authService.setRedirectUrl(`/tournament-description/${this.route.snapshot.params['id']}`);
        this.router.navigateByUrl('/sign-in',{ replaceUrl: true });
      }
    });
  }

  ngAfterViewInit() {
    this.tournamentId = this.route.snapshot.params['id'];
    this.getTournamentInformation(this.tournamentId);
    this.getTournamentSponsors(this.tournamentId);
    this.redirectUrl = this.authService.getRedirectUrl();
  }
  private getTournamentInformation(tournamentId: string) {
    this.tournamentsService.getTournamentInformation(tournamentId).subscribe(
      (data) => {
        this.tournamentData = data;
        this.name = this.tournamentData.name;
        this.discipline = this.tournamentData.discipline;
        this.seedingType = this.tournamentData.seedingType;
        const tournamentDate = new Date(this.tournamentData.date);
        tournamentDate.setHours(tournamentDate.getHours() + 1);
        const formattedDate = tournamentDate.toISOString().slice(0, 16);
        this.date = formattedDate;
        this.address = this.tournamentData.address;
        const tournamentApplicationDeadline = new Date(this.tournamentData.applicationdeadline);
        tournamentApplicationDeadline.setHours(tournamentApplicationDeadline.getHours() + 1);
        const formattedApplicationDeadline = tournamentApplicationDeadline.toISOString().slice(0, 16);
        this.applicationDeadline = formattedApplicationDeadline;
        this.maxParticipants = this.tournamentData.maxparticipants;
        this.seedingType = this.tournamentData.seedingtype;
      },
      (error) => {
        console.error('Error fetching tournament information:', error);
      }
    );
  }

  private getTournamentSponsors(tournamentId: string) {
    this.tournamentsService.getTournamentSponsors(tournamentId).subscribe(
      (data) => {
        this.tournamentSponsors = data;
        this.sponsors = this.tournamentSponsors
      },
      (error) => {
        console.error('Error fetching tournament sponsors:', error);
      }
    );
  }

  addSponsor(): void {
    this.tournamentSponsors.push({ name: '', url: '', imageurl: '' });
  }

  removeSponsor(index: number): void {
    this.tournamentSponsors.splice(index, 1);
  }


  editTournament(): void {
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
      id:this.tournamentId,
      name: this.name,
      discipline: this.discipline,
      date: this.date,
      maxParticipants: this.maxParticipants,
      applicationDeadline: this.applicationDeadline,
      address: this.address,
      seedingType: this.seedingType,
      sponsors: this.sponsors,
    };
    this.createTournamentService.editTournament(tournamentData).subscribe(
      (response: any) => {
        if(response.message){
          console.log("response: " + response);
          this.disableButton = true;
          this.errorMessage = 'Tournament edited successfully';
          this.showError = true;
          setTimeout(() => {
            this.disableButton = false;
            this.showError = false;
            this.errorMessage = "";
            this.router.navigateByUrl(this.redirectUrl, { replaceUrl: true });
          }, 5000);
          return;
        }
      },
      (error) => {
        console.error('Error while editing tournament:', error);
        this.errorMessage = 'Error while editing tournament';
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
