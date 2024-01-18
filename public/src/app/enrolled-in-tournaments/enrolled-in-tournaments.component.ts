import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { TournamentsService } from '../tournaments.service';
import { Subscription } from 'rxjs';
interface Tournament {
  id: number;
  organizer: number;
  name: string;
  discipline: string;
  date: string;
  maxparticipants: number;
  applicationdeadline: string;
  address: string;
  seedingtype: string;
}
@Component({
  selector: 'app-enrolled-in-tournaments',
  templateUrl: './enrolled-in-tournaments.component.html',
  styleUrl: './enrolled-in-tournaments.component.css'
})
export class EnrolledInTournamentsComponent {
  isLoggedIn: boolean = false;
  displayedTournaments: Tournament[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  numberOfUpcomingTournamentsValue: number = 0;
  private subscription?: Subscription;
  tournamentsPerPage: number = 6;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private tournamentsService: TournamentsService,
    ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.authService.setRedirectUrl('/my-tournaments');
        this.router.navigateByUrl('/sign-in');
      } else {
       this.getEnrolledInTournaments();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  calculatePages(totalItems: number, itemsPerPage: number, currentPage: number, displayCount: number = 5): number[] {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages: number[] = [];

    const firstPage = 1;
    const lastPage = totalPages;
    const halfDisplay = Math.floor(displayCount / 2);

    let startPage = Math.max(firstPage, currentPage - halfDisplay);
    let endPage = Math.min(lastPage, startPage + displayCount - 1);

    if (lastPage - startPage + 1 < displayCount) {
      startPage = Math.max(firstPage, lastPage - displayCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }



  selectvaluesIntournament(page: number) {
    this.currentPage = page;
    this.getEnrolledInTournaments();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEnrolledInTournaments();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getEnrolledInTournaments();
    }
  }

  updateSearch() {
    this.currentPage = 1;
    this.getEnrolledInTournaments();
  }

  private getEnrolledInTournaments() {
    const startIndex = (this.currentPage - 1) * this.tournamentsPerPage;
    const endIndex = startIndex + this.tournamentsPerPage ;
    this.subscription = this.tournamentsService.getEnrolledInTournamentsPage(startIndex, endIndex, this.searchTerm).subscribe(
      (response: any) => {
        this.numberOfUpcomingTournamentsValue = response.totalCount;
        this.totalPages = Math.ceil(response.totalCount / this.tournamentsPerPage);
        this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
        this.displayedTournaments = response.tournaments;
      },
      (error) => {
        console.error('Error fetching tournaments:', error);
      }
    );
  }

  editTournament(tournamentId: number){
    this.authService.setRedirectUrl(`/tournament-description/${tournamentId}`);
    this.router.navigateByUrl(`/edit-tournament/${tournamentId}`);
  }
}
